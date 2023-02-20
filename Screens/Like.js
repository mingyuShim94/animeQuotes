import React, { useEffect, useState, useRef, useCallback } from "react";
import { Text, FlatList, Dimensions, Pressable } from "react-native";
import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colorList from "../Assets/colorList";
const STORAGE_LIKE_LIST = "@my_likes_list";
const STORAGE_LIKE_IDX = "@my_likes_idx";
const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("window").height;
const Like = ({ route, navigation: { goBack } }) => {
  const [likeIdx, setLikeIdx] = useState([]);
  const [likeList, setLikeList] = useState([]);
  const [tempLikeList, setTempLikeList] = useState([]);

  const noteLikeData = async (item) => {
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
    if (newLikeList == undefined) newLikeList = [];
    setLikeList(newLikeList);
    setLikeIdx(newLikeIdx);
    console.log("saveLikeList", newLikeList);
    console.log("saveLikeIdx", newLikeIdx);
  };

  const storeLikeData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_LIKE_IDX, JSON.stringify(likeIdx));
      await AsyncStorage.setItem(STORAGE_LIKE_LIST, JSON.stringify(likeList));
    } catch (e) {
      alert(e);
    }
  };
  useEffect(() => {
    setTempLikeList(route.params.list);
    setLikeList(route.params.list);
    setLikeIdx(route.params.idx);
    console.log("likeScreen", route.params.list);
    console.log("likeScreen", route.params.idx);
  }, []);
  return (
    <WindowContainer>
      {route.params.list.length == 0 ? (
        <QuoteScreen
          style={{
            backgroundColor: colorList[Math.floor(Math.random() * 20)],
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 32,
              fontFamily: "Cafe24Shiningstar",
              lineHeight: 45,
              textAlign: "center",
            }}
          >
            {"'좋아요' 한 문장이 없습니다.^^"}
          </Text>
          <Pressable
            onPress={() => {
              goBack();
              storeLikeData();
            }}
            style={{ position: "absolute", top: 13, left: 13 }}
          >
            <MaterialCommunityIcons
              name="keyboard-backspace"
              size={24}
              color="white"
            />
          </Pressable>
        </QuoteScreen>
      ) : (
        <SlideView
          data={tempLikeList}
          keyExtractor={(_, index) => index}
          horizontal
          pagingEnabled
          initialScrollIndex={0}
          initialNumToRender={1}
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
                <Pressable
                  onPress={() => {
                    noteLikeData(item);
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
                    goBack();
                    storeLikeData();
                  }}
                  style={{ position: "absolute", top: 13, left: 13 }}
                >
                  <MaterialCommunityIcons
                    name="keyboard-backspace"
                    size={24}
                    color="white"
                  />
                </Pressable>
              </QuoteScreen>
            );
          }}
        />
      )}
    </WindowContainer>
  );
};
export default Like;

const WindowContainer = styled.View`
  flex: 1;
  background-color: yellow;
`;
const SlideView = styled.FlatList`
  flex: 1;
  background-color: skyblue;
`;
const QuoteScreen = styled.View`
  flex: 1;
  background-color: pink;
  width: ${WindowWidth}px;
  align-items: center;
  justify-content: center;
  padding-horizontal: 13px;
`;
