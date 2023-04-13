import SkeletonLoader from "expo-skeleton-loader";
import { Card } from "react-native-paper";

function CategoryCardSkeleton() {
  return (
    <Card style={{ flex: 1, margin: 5, overflow: "hidden" }}>
      <SkeletonLoader
        duration={400}
        boneColor="#272727"
        highlightColor="#413652"
      >
        <SkeletonLoader.Item
          style={{ flex: 1, width: 200, height: 100 }}
        ></SkeletonLoader.Item>
      </SkeletonLoader>
    </Card>
  );
}

export default CategoryCardSkeleton;
