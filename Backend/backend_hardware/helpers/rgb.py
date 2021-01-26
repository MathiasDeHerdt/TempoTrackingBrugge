import time
from rpi_ws281x import *
import argparse

# ledstrip configuration:
LED_COUNT = 42
LED_PIN = 18
LED_FREQ_HZ = 800000
LED_DMA = 10
LED_BRIGHTNESS = 255
LED_INVERT = False
LED_CHANNEL = 0


# turn ledstrip red on led a time, this takes 10 seconds
def colorRed(strip, color, wait_ms=240):  # duurt 10 sec om de ledstrip af te gaan
    for i in range(strip.numPixels()):
        strip.setPixelColor(i, color)
        strip.show()
        time.sleep(wait_ms/1000)


# make ledstrip turn green
def colorGreen(strip, color, wait_ms=1):
    for i in range(strip.numPixels()):
        strip.setPixelColor(i, color)
        strip.show()
        time.sleep(wait_ms/1000.0)


# remove all colors from ledstrip
def colorWipe(strip, color, wait_ms=1):
    for i in range(strip.numPixels()):
        strip.setPixelColor(i, color)
        strip.show()
        time.sleep(wait_ms/1000.0)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-c', '--clear', action='store_true',
                        help='clear the display on exit')
    args = parser.parse_args()

    strip = Adafruit_NeoPixel(
        LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL)
    strip.begin()

    print('Press Ctrl-C to quit.')
    if not args.clear:
        print('Use "-c" argument to clear LEDs on exit')

    try:
        print('wait')
        colorRed(strip, Color(255, 0, 0))
        print('GO')
        colorGreen(strip, Color(0, 255, 0))
        time.sleep(3)
        colorWipe(strip, Color(0, 0, 0))
        time.sleep(1)

    except KeyboardInterrupt:
        if args.clear:
            colorWipe(strip, Color(0, 0, 0), 10)
