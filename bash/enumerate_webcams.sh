#! /bin/bash

##requires v4l2-ctl and fswebcam

TEST_FILE=/tmp/test.jpg

RESOLUTION=320x240

list=`v4l2-ctl --list-devices`

cameras=""

title=""

while read line;
do
	rm -f ${TEST_FILE}

	if [[ "$line" =~ :$ ]]; then
		title=$line
	fi

	if [[ "$line" =~ /dev ]]; then
		device=$(echo -e "$line" | tr -d '[:space:]')

		fswebcam -r ${RESOLUTION} -d ${device} ${TEST_FILE} > /dev/null 2>&1

		if [ -f ${TEST_FILE} ]; then
			cameras="\"${title}\",${device}"
			cameras=$(echo -e "${cameras}\n")
		fi
	fi

done <<< $list

echo ${cameras}
