import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import useWishlistStore from "../../Store/WishlistStore";
import { Colors } from "../../assets/Colors";
import CartIconWithBadge from "../../components/Carticon";
import ProfileIcon from "../../components/ProfileIcon";
import useAuthStore from "../../Store/AuthStore";
import { useRouter } from "expo-router";
import WishListItem from "../../components/WishListItem";
import EmptyCart from "../../components/EmptyCart";

export default function Wishlist() {
  const { wishlist } = useWishlistStore();
  const router = useRouter();
 
 
 
  
  const { isAuthenticated } = useAuthStore();
const renderItem = ({ item }) => {
  
  
  return (
    <WishListItem
      item={item}
      />)
}
  

  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.SECONDARY }}>
          
      <View className="mb-1"> 
      <View className="flex flex-row w-full justify-between px-6 my-3">
       <View className="flex-row items-center  py-3 bg-white">
                <TouchableOpacity 
                  onPress={() => router.back()} 
                   className="flex-row items-center w-40 gap-3"
                >
                  <Ionicons name="arrow-back" size={24} color="black" />
                  <Text className="text-heading-big">Wishlist</Text>
                </TouchableOpacity>
              </View>
        <View className="flex flex-row items-center gap-2">
        <CartIconWithBadge/>
{isAuthenticated() && <ProfileIcon />}
        </View>
        </View>
        </View>
{wishlist.length===0 && 
       <EmptyCart/>
}
    
    <FlatList
    data={wishlist}
    renderItem={renderItem}/>

     
   
    </SafeAreaView>
    
  );
}
