import React from "react";
import { Text } from "react-native-paper";
import { TouchableNativeFeedback, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { BookType } from "../types";
import { theme } from "../constants";
import { trimText } from "../utils";
import BaseImage from "./BaseImage";
import { Link } from "expo-router";
import { LiveAppState } from "../store/store";

function BookCard({ book }: { book: BookType }) {
  // const router = useRouter();

  // function openBookPage() {
  //   LiveAppState.selectedBookPreInfo.set(book);
  //   router.push(`/explore/category/subcategory/books/${book.id}`);
  //   // router.push({pathname: `/explore/category/subcategory/books`, params: { id: book.id } });
  // }

  return (
    <Animatable.View
      animation={"fadeInUp"}
      style={{
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 15,
        overflow: "hidden",
      }}
    >
      <Link href={`/explore/category/subcategory/books/${book.id}`} asChild>
        <TouchableNativeFeedback
          onPress={() => {
            LiveAppState.selectedBookPreInfo.set(book);
          }}
          background={TouchableNativeFeedback.Ripple(
            theme.colors.primaryContainer,
            false
          )}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              padding: 10,
              overflow: "hidden",
            }}
          >
            <BaseImage
              style={{ height: 200, width: 135, borderRadius: 10 }}
              source={{ uri: book.cover }}
              placeholderStyles={{
                height: 200,
                width: 135,
                borderRadius: 10,
                top: 10,
                left: 10,
              }}
            />
            <View
              style={{
                paddingHorizontal: 10,
                flex: 1,
              }}
            >
              <View>
                <Text
                  variant="titleMedium"
                  style={{ lineHeight: 18, marginBottom: 5 }}
                >
                  {trimText(book.title, 60)}
                </Text>
                <Text style={{}}>{book.authors[0].name}</Text>
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
                      }}
                    >
                      Publisher
                    </Text>
                  </View>
                  {book.publisher ? (
                    <Text>{trimText(book.publisher, 40)}</Text>
                  ) : (
                    <Text style={{ textDecorationLine: "line-through" }}>
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
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={{ marginRight: 10, fontWeight: "bold" }}>
                        Pages
                      </Text>
                    </View>
                    {book.pages ? (
                      <Text>{book.pages}</Text>
                    ) : (
                      <Text style={{ textDecorationLine: "line-through" }}>
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
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={{ fontWeight: "bold", marginRight: 10 }}>
                        Year
                      </Text>
                    </View>
                    {book.year ? (
                      <Text>{book.year}</Text>
                    ) : (
                      <Text style={{ textDecorationLine: "line-through" }}>
                        missing
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      borderRadius: 10,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={{ fontWeight: "bold", marginRight: 10 }}>
                        Type
                      </Text>
                    </View>
                    {book.extension ? (
                      <Text>{book.extension}</Text>
                    ) : (
                      <Text style={{ textDecorationLine: "line-through" }}>
                        missing
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
      </Link>
    </Animatable.View>
  );
}

export default BookCard;
