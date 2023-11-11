# canvas-text-rendering-comparison

A research comparing canvas output across different platforms.

## Web platform

```sh
clone https://github.com/mlewand/canvas-text-rendering-comparison.git
cd canvas-text-rendering-comparison/html
yarn install
yarn start
```

This will open your web browser to a canvas playground page.

## Image comparing

You can use [Image Magick's CLI compare function](https://imagemagick.org/script/compare.php).

```cli
magick compare lorem-ipsum-short-chrome.png lorem-ipsum-short-safari.png lorem-ipsum-short__diff-chrome-safari.png
magick compare lorem-ipsum-short-chrome.png lorem-ipsum-short-firefox.png lorem-ipsum-short__diff-chrome-ff.png
```

I recommend also using ImageDiff app from AppStore to compare two images side by side (I find "wiper" compare mode to be the best).
