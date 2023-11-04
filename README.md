# canvas-text-rendering-comparison

A research comparing canvas output across different platforms.

## Image comparing

You can use [Image Magick's CLI compare function](https://imagemagick.org/script/compare.php).

```cli
magick compare lorem-ipsum-short-chrome.png lorem-ipsum-short-safari.png lorem-ipsum-short__diff-chrome-safari.png
magick compare lorem-ipsum-short-chrome.png lorem-ipsum-short-firefox.png lorem-ipsum-short__diff-chrome-ff.png
```
