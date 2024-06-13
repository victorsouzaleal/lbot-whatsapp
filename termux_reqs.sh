#!/bin/sh
pkg install nodejs-lts -y && pkg install python -y && pkg install ffmpeg -y
cd ~  && [ ! -d ".gyp" ] && mkdir ~/.gyp
cd ~/.gyp && [ -f "include.gypi" ] && rm ~/.gyp/include.gypi
echo "{
	'variables': {
		'android_ndk_path': ''
	}
}" >> ~/.gyp/include.gypi