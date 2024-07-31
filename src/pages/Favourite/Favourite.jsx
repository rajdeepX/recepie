import { useState, useEffect } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import "./Favourite.scss";

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  const navigate = useNavigate();

  const fetchFavorites = async () => {
    setIsLoading(true);
    if (user) {
      try {
        const userFavoritesRef = collection(db, "users", user.uid, "favorites");
        const snapshot = await getDocs(userFavoritesRef);
        const favs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFavorites(favs);
      } catch (error) {
        console.log("Error fetching favorite recipes:", error);
      }
    } else navigate("/");

    setIsLoading(false);
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!recipeId) {
      console.error("Missing recipe ID for deletion.");
      return; // Prevent errors if ID is missing
    }

    const recipeRef = doc(db, "users", user.uid, "favorites", recipeId);
    try {
      await deleteDoc(recipeRef);
      const updatedFavorites = favorites.filter(
        (recipe) => recipe.id !== recipeId
      );
      setFavorites(updatedFavorites);
      console.log("Recipe deleted successfully!");
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="fav__container">
      <h2 className="heading-secondary">Favorite Recipes</h2>
      {isLoading && (
        <div className="alert alert-danger" role="alert">
          Please wait
        </div>
      )}
      <div>
        {favorites.map((recipe) => (
          <div className="card" key={recipe._id}>
            <Link to={`/recipe/${recipe.id}`} className="card__img-container">
              <img
                className="card__img"
                src={recipe.fileUrl}
                alt="recipe image"
              />
            </Link>
            <div className="card__text-con">
              <div className="card__text">
                <div className="card__title">
                  <h3 className="heading-title">{recipe.title}</h3>
                </div>
                <div className="card__items">
                  <p>{recipe.cat}</p>
                </div>
                <div className="card__category">
                  <p>{recipe.category}</p>
                </div>
                <p className="card__username">{recipe.name}</p>
              </div>
              <div className="card__btn">
                <button
                  onClick={() => handleDeleteRecipe(recipe.id)}
                  className="btn-delete"
                >
                  Remove from Favourites
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorite;
