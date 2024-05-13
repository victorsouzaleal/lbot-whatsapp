#!/bin/sh
pkg update && pkg upgrade
pkg install git -y && pkg install node-lts -y && pkg install python -y && pkg install ffmpeg -y
cd ~ && mkdir .gyp && cd .gyp
echo '{
	'variables': {
		'android_ndk_path': ''
	}
}' >> ~/.gyp/include.gypi