import React from "react";
import { Text } from "react-native-paper";
import { TouchableNativeFeedback, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { BookType } from "../types";
import { theme } from "../constants";
import { trimText } from "../utils";
import BaseImage from "./BaseImage";
import { Link, useRouter } from "expo-router";
import { LiveAppState } from "../store/store";

function BookCard({
  book,
  onPress = null,
}: {
  book: BookType;
  onPress: (book: BookType) => void;
}) {
  const router = useRouter();

  function openBookPage() {
    LiveAppState.selectedBookPreInfo.set(book);
    router.push(`/explore/category/subcategory/books/${book.id}`);
  }

  return (
    <View
      style={{
        marginVertical: 5,
        borderRadius: 15,
        overflow: "hidden",
      }}
    >
      <TouchableNativeFeedback
        onPress={onPress ? () => onPress(book) : () => openBookPage()}
        background={TouchableNativeFeedback.Ripple(
          LiveAppState.themeValue.get().colors.primaryContainer,
          false
        )}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            overflow: "hidden",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <BaseImage
            style={{ height: 200, width: 140, borderRadius: 5 }}
            source={{ uri: book.cover }}
            placeholderStyles={{
              height: 200,
              width: 140,
              borderRadius: 5,
              top: 10,
              left: 10,
            }}
          />
          <View
            style={{
              paddingLeft: 10,
              flex: 1,
            }}
          >
            <View>
              <Text
                variant="titleMedium"
                style={{
                  lineHeight: 18,
                  marginBottom: 5,
                  fontSize: 14,
                  color: LiveAppState.themeValue.get().colors.onBackground,
                }}
              >
                {trimText(book.title, 70)}
              </Text>
              <Text
                style={{
                  color: LiveAppState.themeValue.get().colors.onBackground,
                }}
              >
                {book.authors[0].name}
              </Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <View
                style={{
                  borderRadius: 10,
                  paddingVertical: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginRight: 10,
                      color: LiveAppState.themeValue.get().colors.onBackground,
                    }}
                  >
                    Publisher
                  </Text>
                </View>
                {book.publisher ? (
                  <Text
                    style={{
                      color: LiveAppState.themeValue.get().colors.onBackground,
                    }}
                  >
                    {trimText(book.publisher, 40)}
                  </Text>
                ) : (
                  <Text
                    style={{
                      textDecorationLine: "line-through",
                      color: LiveAppState.themeValue.get().colors.onBackground,
                    }}
                  >
                    missing
                  </Text>
                )}
              </View>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    borderRadius: 10,
                    marginRight: 10,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        marginRight: 10,
                        fontWeight: "bold",
                        color:
                          LiveAppState.themeValue.get().colors.onBackground,
                      }}
                    >
                      Pages
                    </Text>
                  </View>
                  {book.pages ? (
                    <Text
                      style={{
                        color:
                          LiveAppState.themeValue.get().colors.onBackground,
                      }}
                    >
                      {book.pages}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        textDecorationLine: "line-through",
                        color:
                          LiveAppState.themeValue.get().colors.onBackground,
                      }}
                    >
                      missing
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    borderRadius: 10,
                    marginRight: 10,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        marginRight: 10,
                        color:
                          LiveAppState.themeValue.get().colors.onBackground,
                      }}
                    >
                      Year
                    </Text>
                  </View>
                  {book.year ? (
                    <Text
                      style={{
                        color:
                          LiveAppState.themeValue.get().colors.onBackground,
                      }}
                    >
                      {book.year}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        textDecorationLine: "line-through",
                        color:
                          LiveAppState.themeValue.get().colors.onBackground,
                      }}
                    >
                      missing
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    borderRadius: 10,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        marginRight: 10,
                        color:
                          LiveAppState.themeValue.get().colors.onBackground,
                      }}
                    >
                      Type
                    </Text>
                  </View>
                  {book.extension ? (
                    <Text
                      style={{
                        color:
                          LiveAppState.themeValue.get().colors.onBackground,
                      }}
                    >
                      {book.extension}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        textDecorationLine: "line-through",
                        color:
                          LiveAppState.themeValue.get().colors.onBackground,
                      }}
                    >
                      missing
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

export default BookCard;
