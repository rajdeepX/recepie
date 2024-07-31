import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import "./Home.scss";
import db from "../../firebase/firebaseConfig";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

const Home = ({ isAuth }) => {
  const [recipeData, setRecipeData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);
    const recipe = await getDocs(collection(db, "recipes"));

    const recipe_data = recipe.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    setRecipeData(recipe_data);
    setIsLoading(false);
    console.log("success");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFav = async (recipe) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const userFavoritesRef = collection(db, "users", user.uid, "favorites");
        await addDoc(userFavoritesRef, recipe);
        console.log("Recipe added to favorites!");
      } catch (error) {
        console.log("Error adding to favorites:", error);
      }
    } else {
      console.log("No user is logged in");
    }
  };

  const handleSort = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === "all") {
      setSelectedCategories([]);
    } else {
      const selected = [...e.target.options]
        .filter((option) => option.selected)
        .map((option) => option.value.toLowerCase());
      setSelectedCategories(selected);
    }

    console.log(selectedValue);
  };

  const filteredRecipes = recipeData
    ? recipeData.filter((recipe) => {
        // If no categories selected, show all recipes
        if (selectedCategories.length === 0) return true;

        // Check if recipe category matches any selected category
        return selectedCategories.some(
          (category) => recipe.cat.toLowerCase() === category
        );
      })
    : [];

  return (
    <>
      <section className="section-home">
        {isLoading && (
          <div className="alert alert-danger" role="alert">
            Please wait
          </div>
        )}
        <div className="home__heading">
          <h1 className="heading-primary">Recipe Book</h1>
        </div>
        <div className="select__container">
          <select
            name="cat"
            id="cat"
            className="select__box"
            onChange={handleSort}
          >
            <option value="all">All</option>
            <option value="Non-veg">Non-veg</option>
            <option value="Veg">Veg</option>
          </select>
        </div>
        {filteredRecipes.length === 0 && <p>No recipes found</p>}
        <div className="home__card-container">
          {recipeData &&
            filteredRecipes.map((recipe) => (
              <div className="card" key={recipe._id}>
                <Link
                  to={`recipe/${recipe.id}`}
                  className="card__img-container"
                >
                  <img
                    className="card__img"
                    src={recipe.fileUrl}
                    alt="recipe image"
                  />
                </Link>
                <div className="card__text-con">
                  <div className="card__text">
                    <div className="card__title">
                      <h3 className="card__heading">{recipe.title}</h3>
                    </div>
                    <p className="card__items">{recipe.cat}</p>
                    <p className="card__username">
                      Posted by {recipe.name.toUpperCase()}
                    </p>
                  </div>
                  <div className="card__btn">
                    {!isAuth ? (
                      ""
                    ) : (
                      <button
                        onClick={() => handleFav(recipe)}
                        className="btn-secondary"
                      >
                        Add to Favourites
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </>
  );
};
export default Home;
