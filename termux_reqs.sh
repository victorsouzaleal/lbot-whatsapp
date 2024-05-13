#!/bin/sh
pkg update -y && pkg upgrade -y
pkg install git -y && pkg install nodejs-lts -y && pkg install python -y && pkg install ffmpeg -y
cd ~ && mkdir .gyp && cd .gyp
echo '{
	'variables': {
		'android_ndk_path': ''
	}
}' >> ~/.gyp/include.gypi