#!/usr/bin/env python3

import os
import re
import tempfile
import threading
import urllib.request

import gi
gi.require_version('Gtk', '3.0')  # noqa
gi.require_version('Gdk', '3.0')  # noqa
from gi.repository import Gdk, GdkPixbuf, GLib, Gtk
from mtgsdk import Card

CARD_WIDTH = 100
CARD_HEIGHT = 139

builder = Gtk.Builder()
builder.add_from_file('glade/overseer-main.glade')

window = builder.get_object('overseer-main')
window.show_all()

search_entry = builder.get_object('search-entry')
card_listbox = builder.get_object('card-listbox')
loading_spinner = builder.get_object('loading-spinner')
loading_spinner.hide()

placeholder_pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_size(
    'images/example_card.jpg', width=CARD_WIDTH, height=CARD_HEIGHT)

cardlist = []


def set_loading(loading=False):
    if loading:
        loading_spinner.start()
        loading_spinner.show()
    else:
        loading_spinner.stop()
        loading_spinner.hide()


def start_thread(target, *args, **kwargs):
    thread = threading.Thread(
        target=target, args=args, kwargs=kwargs)
    thread.daemon = True
    thread.start()


def load_images(cardlist):
    for card in cardlist:
        if not hasattr(card, '_image'):
            continue
        load_image(card.image_url, card._image)


def search_finish(cardlist):
    set_loading(False)

    # clear the card list
    for child in card_listbox.get_children():
        card_listbox.remove(child)

    for card in cardlist:
        if not card.image_url:
            continue

        print('{}: {}'.format(card.name, card.image_url))

        if card.mana_cost:
            mana_items = re.findall(r'\{(.*?)\}', card.mana_cost)
        else:
            mana_items = []

        row_builder = Gtk.Builder()
        row_builder.add_from_file('glade/card-row.glade')
        row = row_builder.get_object('card-row')
        row._card = card
        mana_box = row_builder.get_object('mana-box')

        image = row_builder.get_object('card-image')
        image.set_from_pixbuf(placeholder_pixbuf)
        card._image = image

        for field in ('name', 'type', 'text', 'flavor', ):
            widget = row_builder.get_object('card-{}'.format(field))
            widget.set_text((getattr(card, field, '') or '').strip())

        for cost in mana_items:
            pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_size(
                'images/mana-{}.jpg'.format(cost.replace('/', '').lower()),
                width=12,
                height=12)

            image = Gtk.Image()
            image.set_from_pixbuf(pixbuf)
            mana_box.add(image)

        card_listbox.add(row)

    start_thread(load_images, cardlist)

    card_listbox.show_all()


def run_search():
    global cardlist

    set_loading(True)
    cardlist = Card.where(name=search_entry.get_text()).all()

    GLib.idle_add(search_finish, cardlist)


def key_release(widget, event_key):
    keyval = event_key.get_keyval()[1]
    if keyval == Gdk.KEY_Escape:
        Gtk.main_quit()
        return True
    elif keyval == Gdk.KEY_Return:
        search_entry.select_region(0, -1)
        return False

    return False


def load_image(url, image, width=CARD_WIDTH, height=CARD_HEIGHT, resize=True):
    try:
        response = urllib.request.urlopen(url)
    except AttributeError:
        # not sure why this happens yet.
        return

    data = response.read()

    image_file = tempfile.NamedTemporaryFile(mode='w+b', delete=False)
    image_file.write(data)
    image_file.close()

    if resize:
        pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_size(
            image_file.name, width=width, height=height)
    else:
        pixbuf = GdkPixbuf.Pixbuf.new_from_file(image_file.name)

    os.unlink(image_file.name)

    GLib.idle_add(image.set_from_pixbuf, pixbuf)


def show_card(listbox, item):
    builder = Gtk.Builder()
    builder.add_from_file('glade/card-window.glade')
    window = builder.get_object('card-window')
    image = builder.get_object('card-image')

    start_thread(load_image, item._card.image_url, image, resize=False)
    window.show_all()

    window.connect('key-release-event',
                   lambda window, event: window.destroy())
    window.connect('focus-out-event',
                   lambda window, event: window.destroy())


handlers = {
    'onDeleteWindow': Gtk.main_quit,
    'onSearch': lambda obj: start_thread(run_search),
    'onKeyRelease': key_release,
    'onRowActivated': show_card,
}

builder.connect_signals(handlers)

Gtk.main()
