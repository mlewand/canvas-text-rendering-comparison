# canvas-text-rendering-comparison

A research comparing canvas output across different platforms.

## Image comparing

You can use [Image Magick's CLI compare function](https://imagemagick.org/script/compare.php).

```cli
magick compare Chrome-lorem-ipsum-short.png Safari-lorem-ipsum-short.png chrome-safari-diff.png
magick compare Chrome-lorem-ipsum-short.png Firefox-lorem-ipsum-short.png chrome-ff-diff.png
```
