mkdir logo.iconset
sips -z 64 64     large.png --out logo.iconset/icon_32x32@2x.png
sips -z 128 128   large.png --out logo.iconset/icon_128x128.png
sips -z 256 256   large.png --out logo.iconset/icon_128x128@2x.png
sips -z 256 256   large.png --out logo.iconset/icon_256x256.png
sips -z 512 512   large.png --out logo.iconset/icon_256x256@2x.png
sips -z 512 512   large.png --out logo.iconset/icon_512x512.png
cp large.png logo.iconset/icon_512x512@2x.png
iconutil -c icns logo.iconset
rm -R logo.iconset
