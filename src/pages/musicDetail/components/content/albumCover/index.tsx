import React, {useMemo} from 'react';
import rpx from '@/utils/rpx';
import {ImgAsset} from '@/constants/assetsConst';
import FastImage from '@/components/base/fastImage';
import useOrientation from '@/hooks/useOrientation';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import TrackPlayer from '@/core/trackPlayer';
import globalStyle from '@/constants/globalStyle';
import {View} from 'react-native';
import Operations from './operations';
import {showPanel} from '@/components/panels/usePanel.ts';

interface IProps {
    onTurnPageClick?: () => void;
}

export default function AlbumCover(props: IProps) {
    const {onTurnPageClick} = props;

    const musicItem = TrackPlayer.useCurrentMusic();
    const orientation = useOrientation();

    const artworkStyle = useMemo(() => {
        if (orientation === 'vertical') {
            return {
                width: rpx(500),
                height: rpx(500),
                borderRadius: rpx(12),
            };
        } else {
            return {
                width: rpx(260),
                height: rpx(260),
                borderRadius: rpx(8),
            };
        }
    }, [orientation]);

    const longPress = Gesture.LongPress()
        .onStart(() => {
            if (musicItem?.artwork) {
                showPanel('ImageViewer', {
                    url: musicItem.artwork,
                });
            }
        })
        .runOnJS(true);

    const tap = Gesture.Tap()
        .onStart(() => {
            onTurnPageClick?.();
        })
        .runOnJS(true);

    const combineGesture = Gesture.Race(tap, longPress);

    return (
        <>
            <GestureDetector gesture={combineGesture}>
                <View style={globalStyle.fullCenter}>
                    <FastImage
                        style={artworkStyle}
                        uri={musicItem?.artwork}
                        emptySrc={ImgAsset.albumDefault}
                    />
                </View>
            </GestureDetector>
            <Operations />
        </>
    );
}