import { ScrollView, View, StyleSheet, Dimensions,Image , Text, TouchableOpacity} from "react-native";
import { Card, TouchableRipple } from "react-native-paper";
import SectionHeading from "./SectionHeading";
import LightDivider from "./LightDivider";
import Category from "./Category";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "./helpers/navigation";
import {addToCartWithoutAddons} from "./helpers/helpers"
import { useCart } from "./context/CartContext";


const products = [
  {
    id: "1",
    name: "Stylish Jacket",
    price: 50.0,
    extraPrice: 70.0,
    image:
      "https://png.pngtree.com/png-vector/20240715/ourmid/pngtree-hamburger-png-image_13094305.png",
  },
  {
    id: "2",
    name: "Elegant Shoes",
    price: 79.99,
    extraPrice: 99.0,
    image:
      "https://lh3.googleusercontent.com/nUCLbomg1F5rlyqtICs6tODAO5m7PjzxXUcOMQNRGsyUfvdzsOs7_0JnYWgTPqcGpSF0G4OmLrRMP03djBZ0SBjzIXL_6n7gbJop2CE",
  },
  {
    id: "3",
    name: "Classic Watch",
    price: 149.99,
    extraPrice: 200.0,
    image:
      "https://png.pngtree.com/png-vector/20240715/ourmid/pngtree-hamburger-png-image_13094305.png",
  },
  {
    id: "4",
    name: "Denim Jeans",
    price: 59.99,
    extraPrice: 70.0,
    image:
      "https://lh3.googleusercontent.com/nUCLbomg1F5rlyqtICs6tODAO5m7PjzxXUcOMQNRGsyUfvdzsOs7_0JnYWgTPqcGpSF0G4OmLrRMP03djBZ0SBjzIXL_6n7gbJop2CE",
  },
  {
    id: "5",
    name: "Stylish Jacket",
    price: 49.99,
    extraPrice: 70.0,
    image:
      "https://png.pngtree.com/png-vector/20240715/ourmid/pngtree-hamburger-png-image_13094305.png",
  },
  {
    id: "6",
    name: "Elegant Shoes",
    price: 79.99,
    extraPrice: 98.0,
    image:
      "https://lh3.googleusercontent.com/nUCLbomg1F5rlyqtICs6tODAO5m7PjzxXUcOMQNRGsyUfvdzsOs7_0JnYWgTPqcGpSF0G4OmLrRMP03djBZ0SBjzIXL_6n7gbJop2CE",
  },
  {
    id: "7",
    name: "Classic Watch",
    price: 49.99,
    extraPrice: 98.0,
    image:
      "https://png.pngtree.com/png-vector/20240715/ourmid/pngtree-hamburger-png-image_13094305.png",
  },
  {
    id: "8",
    name: "Denim Jeans",
    price: 59.99,
    extraPrice: 70.0,
    image:
      "https://lh3.googleusercontent.com/nUCLbomg1F5rlyqtICs6tODAO5m7PjzxXUcOMQNRGsyUfvdzsOs7_0JnYWgTPqcGpSF0G4OmLrRMP03djBZ0SBjzIXL_6n7gbJop2CE",
  },
  {
    id: "9",
    name: "Stylish Jacket",
    price: 49.99,
    extraPrice: 70.0,
    image:
      "https://png.pngtree.com/png-vector/20240715/ourmid/pngtree-hamburger-png-image_13094305.png",
  },
  {
    id: "10",
    name: "Elegant Shoes",
    price: 79.99,
    extraPrice: 99.0,
    image:
      "https://lh3.googleusercontent.com/nUCLbomg1F5rlyqtICs6tODAO5m7PjzxXUcOMQNRGsyUfvdzsOs7_0JnYWgTPqcGpSF0G4OmLrRMP03djBZ0SBjzIXL_6n7gbJop2CE",
  },
  {
    id: "11",
    name: "Classic Watch",
    price: 149.99,
    extraPrice: 250.0,
    image:
      "https://png.pngtree.com/png-vector/20240715/ourmid/pngtree-hamburger-png-image_13094305.png",
  },
  {
    id: "12",
    name: "Denim Jeans",
    price: 59.99,
    extraPrice: 70.0,
    image:
      "https://lh3.googleusercontent.com/nUCLbomg1F5rlyqtICs6tODAO5m7PjzxXUcOMQNRGsyUfvdzsOs7_0JnYWgTPqcGpSF0G4OmLrRMP03djBZ0SBjzIXL_6n7gbJop2CE",
  },
  {
    id: "13",
    name: "Stylish Jacket",
    price: 49.99,
    extraPrice: 70.0,
    image:
      "https://png.pngtree.com/png-vector/20240715/ourmid/pngtree-hamburger-png-image_13094305.png",
  },
  {
    id: "14",
    name: "Elegant Shoes",
    price: 79.99,
    extraPrice: 140.0,
    image:
      "https://lh3.googleusercontent.com/nUCLbomg1F5rlyqtICs6tODAO5m7PjzxXUcOMQNRGsyUfvdzsOs7_0JnYWgTPqcGpSF0G4OmLrRMP03djBZ0SBjzIXL_6n7gbJop2CE",
  },
  {
    id: "15",
    name: "Classic Watch",
    price: 149.99,
    extraPrice: 200.0,
    image:
      "https://png.pngtree.com/png-vector/20240715/ourmid/pngtree-hamburger-png-image_13094305.png",
  },
  {
    id: "16",
    name: "Denim Jeans",
    price: 59.99,
    extraPrice: 70.0,
    image:
      "https://lh3.googleusercontent.com/nUCLbomg1F5rlyqtICs6tODAO5m7PjzxXUcOMQNRGsyUfvdzsOs7_0JnYWgTPqcGpSF0G4OmLrRMP03djBZ0SBjzIXL_6n7gbJop2CE",
  },
];

const ProductsSlider = () => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;
  const navigation = useNavigation<NavigationProp>();
  const { addItem } = useCart();

  return (
    <>
      <View>
      <Text style={styles.heading}>Complete Your Meal</Text>
      </View>

      <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {products.map((product, index) => (
            <View key={product.id} style={styles.cardWrapper}>
              <Card style={styles.card}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: product.image }} style={styles.image} />

                
                </View>
                <View style={styles.plusButton}>
                <TouchableOpacity
                    
                    onPress={() => {
                     const item =  {...product,qty:1,isVeg:1, adOnsTotalPrice:0, productFinalPrice:product.price,extraPriceTotal:product.extraPrice,isWithAdons:0}
                     addToCartWithoutAddons(item, addItem);
                      /* handle add-to-cart here */
                    }}
                  >
                    <Text style={styles.plusText}>+</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>£{product.price}</Text>
                </View>
              </Card>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  heading:{
    fontWeight: 'semibold',
    color: '#555',
    fontFamily: 'sans-serif',
    fontSize:15,
    paddingLeft:5,
    paddingTop:10
  },
  container: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  cardWrapper: {
    marginRight: 12,
  },
  card: {
    // width: 90,
    marginBottom: 5,
    paddingBottom:10,
    borderRadius: 0,
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 2,
  },
  imageContainer: {
    position: "relative",
    width: 70,
    height: 70,
    borderRadius: 0,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 0,
    resizeMode: "cover",
    backgroundColor: "#f5f5f5",
  },
  plusButton: {
    position: "absolute",
    top: 1,
    right: 0,
    backgroundColor: "#fff", // remove green background
    width: 24,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    borderRadius:5,
    borderColor:"#ccc",
  borderWidth: 1, 
  },
  plusText: {
    color: "green", // icon is green instead
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 20,
  },
  productInfo: {
    marginTop: 6,
    alignItems: "center",
  },
  productName: {
    fontSize: 11,
    color: "#333",
    textAlign: "center",
  },
  imageWrapper: {
    marginRight: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default ProductsSlider;
