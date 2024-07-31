import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import db from "../../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import "./Recipe.scss";

const Recipe = () => {
  const [post, setPost] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const fetchRecipe = async (id) => {
    setIsLoading(true);
    const docRef = doc(db, "recipes", id);

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setPost({ id: docSnap.id, ...docSnap.data() });
    } else {
      // Handle case where image is not found
      console.error("Image not found");
    }

    setIsLoading(false);
    return;
  };

  useEffect(() => {
    fetchRecipe(id);
  }, []);

  console.log(post);

  return (
    <section className="section-recipe">
      
      {isLoading && (
        <div className="alert alert-success" role="alert">
          Please wait
        </div>
      )}

      {!post ? (
        " "
      ) : (
        <>
          <div className="recipe">
            <h2 className="heading-secondary">{post.title}</h2>
            <h3 className="recipe__creator">Recipe by {post.name}</h3>
            <div className="recipe__img-container">
              <img
                src={post.fileUrl}
                alt={post.title}
                className="recipe__img"
              />
            </div>
            <div className="recipe__details-container">
              <div className="recipe__ingredients">
                <h3 className="heading-tertiary">Ingredients</h3>
                <div
                  className="content"
                  dangerouslySetInnerHTML={{ __html: post.ingredients }}
                />
              </div>
              <div className="recipe__content">
                <h3 className="heading-tertiary">Steps</h3>
                <div
                  className="content"
                  dangerouslySetInnerHTML={{ __html: post.steps }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};
export default Recipe;
