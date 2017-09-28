#!/usr/bin/env python3

import traceback
import urllib.request


url = 'http://gatherer.wizards.com/Handlers/Image.ashx?size=medium&' \
      'name={}&type=symbol'

colors = ['w', 'b', 'r', 'u', 'c', 'g', 'x']
numbers = list(range(0, 20))


def download_image(name):
    try:
        response = urllib.request.urlopen(url.format(name))
        data = response.read()

        if data:
            with open('mana-{}.jpg'.format(name), 'w+b') as h:
                h.write(data)
    except:
        traceback.print_exc()


for number in numbers:
    download_image(number)

for color in colors:
    download_image(color)
    download_image('{}p'.format(color))

    for other_color in colors:
        download_image('{}{}'.format(color, other_color))
