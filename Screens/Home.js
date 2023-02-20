import React, { useEffect, useState, useRef, useCallback } from "react";
import { Text, FlatList, Dimensions, Pressable } from "react-native";
import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppOpenAd, TestIds } from "react-native-google-mobile-ads";
const adUnitId = __DEV__
  ? TestIds.APP_OPEN
  : "ca-app-pub-8647279125417942/6354683419";
import quoteList from "../Assets/quoteList";
import colorList from "../Assets/colorList";
const STORAGE_LIKE_LIST = "@my_likes_list";
const STORAGE_LIKE_IDX = "@my_likes_idx";
const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("window").height;
colorList.sort(() => Math.random() - 0.5);
quoteList.sort(() => Math.random() - 0.5);
const Home = ({ navigation: { navigate, addListener } }) => {
  const {
    isLoaded: openAdIsLoaded,
    isClosed: openAdIsClosed,
    load: openAdLoad,
    show: openAdShow,
  } = useAppOpenAd(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });
  useEffect(() => {
    openAdLoad();
  }, [openAdLoad]);
  useEffect(() => {
    console.log(openAdIsLoaded);
    if (openAdIsLoaded) openAdShow();
  }, [openAdIsLoaded]);

  const [likeIdx, setLikeIdx] = useState([]);
  const [likeList, setLikeList] = useState([]);
  const [subVisible, setSubVisible] = useState(
    Array.from({ length: quoteList.length }, () => false)
  );
  const storeLikeData = async (item) => {
    var newLikeIdx;
    var preLikeList = [...likeList];
    var newLikeList;
    if (likeIdx.includes(item.id)) {
      newLikeIdx = likeIdx.filter(function (d) {
        return d != item.id;
      });

      newLikeList = preLikeList.filter((d) => {
        return d.id != item.id;
      });
    } else {
      newLikeIdx = [...likeIdx, item.id];
      newLikeList = [...likeList, item];
    }
    setLikeList(newLikeList);
    setLikeIdx(newLikeIdx);
    console.log("saveLikeList", newLikeList);
    console.log("saveLikeIdx", newLikeIdx);
    try {
      await AsyncStorage.setItem(STORAGE_LIKE_IDX, JSON.stringify(newLikeIdx));
      await AsyncStorage.setItem(
        STORAGE_LIKE_LIST,
        JSON.stringify(newLikeList)
      );
    } catch (e) {
      alert(e);
    }
  };
  const getLikeData = async () => {
    var preLikeList;
    var preLikeIdx;
    try {
      const idxValue = await AsyncStorage.getItem(STORAGE_LIKE_IDX);
      const listValue = await AsyncStorage.getItem(STORAGE_LIKE_LIST);
      preLikeIdx = JSON.parse(idxValue);
      preLikeList = JSON.parse(listValue);
      if (preLikeIdx == null) {
        preLikeIdx = [];
      }
      if (preLikeList == null) {
        preLikeList = [];
      }
      // console.log("loadLikeList", preLikeList);
      // console.log("loadLikeIdx", preLikeIdx);
      setLikeIdx(preLikeIdx);
      setLikeList(preLikeList);
    } catch (e) {
      alert(e);
    }
  };
  // useEffect(() => {
  //   getLikeData();
  //   //AsyncStorage.clear();
  // }, []);

  const onSubvisible = (index) => {
    let tempArr = [...subVisible];
    tempArr[index] = true;
    setSubVisible(tempArr);
  };
  useEffect(() => {
    //AsyncStorage.clear();
    addListener("focus", () => {
      getLikeData();
    });
  }, []);

  return (
    <WindowContainer>
      <SlideView
        data={quoteList}
        keyExtractor={(_, index) => index}
        horizontal
        pagingEnabled
        initialScrollIndex={Math.floor(quoteList.length / 2)}
        initialNumToRender={5}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: WindowWidth,
          offset: WindowWidth * index,
          index,
        })}
        renderItem={({ item, index }) => {
          return (
            <QuoteScreen
              style={{
                backgroundColor: colorList[index % colorList.length],
              }}
              onPress={() => {
                onSubvisible(index);
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 30,
                  fontFamily: "Cafe24Shiningstar",
                  lineHeight: 45,
                  textAlign: "center",
                }}
              >
                {`"${item.quote}"`}
              </Text>
              {subVisible[index] ? (
                <>
                  <Text
                    style={{
                      color: "black",
                      fontSize: 23,
                      fontFamily: "Cafe24Shiningstar",
                      marginTop: 30,
                    }}
                  >
                    {`<${item.work}>`}
                  </Text>
                  {item.author != undefined ? (
                    <Text
                      style={{
                        color: "black",
                        fontSize: 20,
                        fontFamily: "Cafe24Shiningstar",
                      }}
                    >
                      {`- ${item.author} -`}
                    </Text>
                  ) : null}
                </>
              ) : (
                <>
                  <Text
                    style={{
                      fontSize: 23,
                      marginTop: 30,
                      fontFamily: "Cafe24Shiningstar",
                    }}
                  >
                    {` `}
                  </Text>
                  {item.author != undefined ? (
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: "Cafe24Shiningstar",
                      }}
                    >
                      {` `}
                    </Text>
                  ) : null}
                </>
              )}

              <Pressable
                onPress={() => {
                  storeLikeData(item);
                }}
                style={{ position: "absolute", bottom: 13, right: 13 }}
              >
                <MaterialCommunityIcons
                  name={likeIdx.includes(item.id) ? "heart" : "heart-outline"}
                  size={35}
                  color="white"
                />
              </Pressable>

              <Pressable
                onPress={() => {
                  navigate("Like", { list: likeList, idx: likeIdx });
                }}
                style={{ position: "absolute", top: 13, left: 13 }}
              >
                <MaterialCommunityIcons
                  name="heart-box-outline"
                  size={35}
                  color="white"
                />
              </Pressable>
            </QuoteScreen>
          );
        }}
      />
    </WindowContainer>
  );
};
export default Home;

const WindowContainer = styled.View`
  flex: 1;
  background-color: yellow;
`;
const SlideView = styled.FlatList`
  flex: 1;
  background-color: skyblue;
`;
const QuoteScreen = styled.Pressable`
  flex: 1;
  background-color: pink;
  width: ${WindowWidth}px;
  align-items: center;
  justify-content: center;
  padding-horizontal: 13px;
`;
