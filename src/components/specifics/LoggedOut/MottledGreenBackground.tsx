import * as React from "react";
import {
  ImageBackgroundProps,
  KeyboardAvoidingView,
  Platform,
  View
} from "react-native";
import Svg, { ClipPath, Defs, G, Path, SvgProps } from "react-native-svg";
import { colors } from "../../../constants";

interface MottledGreenBackgroundProps
  extends Omit<ImageBackgroundProps, "source"> {
  children: React.ReactNode;
  SVGProps?: SvgProps;
}

export const MottledGreenBackground = (props: MottledGreenBackgroundProps) => {
  const { style, resizeMode = "cover", children, SVGProps, ...rest } = props;
  return (
    <KeyboardAvoidingView
      behavior={"height"}
      keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
      enabled={false}
      style={{
        flex: 1,
        zIndex: -1,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        backgroundColor: colors.greenYakka
      }}
      {...rest}
    >
      <View
        style={[
          {
            height: "100%",
            width: "100%",
            position: "absolute",
            top: 0,
            zIndex: 10
          },
          style
        ]}
      >
        {children}
      </View>

      <Svg width={375} height={667} viewBox="0 0 375 667" {...SVGProps}>
        <Defs>
          <ClipPath id="a">
            <Path
              data-name="Rectangle 1479"
              fill="#03c04a"
              d="M0 0H375V667H0z"
            />
          </ClipPath>
          <ClipPath id="b">
            <Path
              data-name="Rectangle 4"
              fill="#fff"
              d="M0 0H471.086V600.195H0z"
            />
          </ClipPath>
        </Defs>
        <G data-name="Mask Group 1">
          <G data-name="Group 9" clipPath="url(#a)">
            <G data-name="Group 7">
              <G
                data-name="Group 6"
                clipPath="url(#b)"
                transform="translate(0 -15.333) rotate(12.04 -1001.703 -335.373)"
                opacity={0.1}
              >
                <G data-name="Group 5">
                  <G data-name="Group 4">
                    <G data-name="Group 3" clipPath="url(#b)">
                      <G data-name="Group 2">
                        <G data-name="Group 1" clipPath="url(#b)">
                          <Path
                            data-name="Path 1"
                            d="M311.909 8.23c-35.926-22.334-74.76 3.419-76.128 45.62-4.908 54.3-55.185 104.965-111 109.843-20.943 1.778-48.917.526-68.845 9.324-76.486 24.051-72.014 139.127-1.963 171.773 71.1 35.043 145.96-86.3 202.331 4.734 19.59 39.738 5.8 66.99-25.842 94.029-32.311 27.612-61.29-11.383-107.175 30.487-31.321 28.58-23.811 74.027 1.386 105.168 24.389 30.142 83.146 26.574 109.978-2.75 49.561-54.166-31.14-144.184 89.945-153.794 43.247-.546 68.723 5.586 106.462-21.381 74.91-54.985 39.3-184.411-62.125-181.789-71.927 4.482-126.992 69.408-164.626-13.06-17.851-39.12 7.177-78.517 45.714-95.565 29.99-13.268 64.89-12.6 78.2-47.934 7.9-20.973-3.226-48.341-16.316-54.7"
                            fill="#fff"
                          />
                        </G>
                      </G>
                    </G>
                  </G>
                </G>
              </G>
            </G>
            <G data-name="Group 8">
              <G
                data-name="Group 6"
                clipPath="url(#b)"
                transform="translate(0 -15.333) rotate(12.04 -111.225 645.37)"
                opacity={0.1}
              >
                <G data-name="Group 5">
                  <G data-name="Group 4">
                    <G data-name="Group 3" clipPath="url(#b)">
                      <G data-name="Group 2">
                        <G data-name="Group 1" clipPath="url(#b)">
                          <Path
                            data-name="Path 1"
                            d="M311.909 8.23c-35.926-22.334-74.76 3.419-76.128 45.62-4.908 54.3-55.185 104.965-111 109.843-20.943 1.778-48.917.526-68.845 9.324-76.486 24.051-72.014 139.127-1.963 171.773 71.1 35.043 145.96-86.3 202.331 4.734 19.59 39.738 5.8 66.99-25.842 94.029-32.311 27.612-61.29-11.383-107.175 30.487-31.321 28.58-23.811 74.027 1.386 105.168 24.389 30.142 83.146 26.574 109.978-2.75 49.561-54.166-31.14-144.184 89.945-153.794 43.247-.546 68.723 5.586 106.462-21.381 74.91-54.985 39.3-184.411-62.125-181.789-71.927 4.482-126.992 69.408-164.626-13.06-17.851-39.12 7.177-78.517 45.714-95.565 29.99-13.268 64.89-12.6 78.2-47.934 7.9-20.973-3.226-48.341-16.316-54.7"
                            fill="#fff"
                          />
                        </G>
                      </G>
                    </G>
                  </G>
                </G>
              </G>
            </G>
          </G>
        </G>
      </Svg>
    </KeyboardAvoidingView>
  );
};
