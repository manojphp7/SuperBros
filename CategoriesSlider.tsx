import { ScrollView, View, StyleSheet, Dimensions,Text } from "react-native";
import { Card, TouchableRipple } from "react-native-paper";
import SectionHeading from "./SectionHeading";
import LightDivider from "./LightDivider";
import Category from "./Category";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "./helpers/navigation"
import axios from "axios";
import { useEffect, useState } from "react";
import { BaseUrl } from "./helpers/helpers";


  type CatItem = {
    id: string;
    name:string;
    img: string;
  };
  

const CategoriesSlider = () => {

  const [categories, setCategories] = useState<CatItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    // Simulating API call
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BaseUrl}user/categories`); // Replace with your actual API
        setCategories(response.data.resultArray);
      } catch (error) {
        console.error("Error fetching Categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
    <View>
        <SectionHeading title="Cateories"/>
    </View>
    
   
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category, index) => (
          <TouchableRipple
            key={index}
            onPress={() => {
              navigation.navigate('Category', { catId: category.id,catName: category.name })
            }}
            borderless
            style={styles.imageWrapper}
          >
            <Card style={styles.card}>
              <Card.Cover source={{ uri: `${BaseUrl}assets/images/cat/${category.img}` }} style={styles.image} />
            </Card>
          </TouchableRipple>
        ))}
      </ScrollView>
    </View>
    </>
  )
}


const styles = StyleSheet.create({
    container: {
      marginVertical: 10,
    },
    imageWrapper: {
      marginRight: 10,
      borderRadius: 10,
      overflow: 'hidden',
    },
    card: {
      width: 120,
      height: 100,
      borderRadius: 10,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      backgroundColor:'#fff'
    },
  });

export default CategoriesSlider