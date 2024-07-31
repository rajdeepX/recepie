import { useRef, useState } from "react";
import "./Create.scss";
import db, { storage } from "../../firebase/firebaseConfig";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import TextEditor from "../../components/TextEditor";

const Create = () => {
  const [name, setName] = useState();
  const [title, setTitle] = useState();
  const [category, setCategory] = useState();
  const [ingredients, setIngredients] = useState();
  const [steps, setSteps] = useState();
  const [fileUrl, setFileUrl] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleUpload = async (e) => {
    let file = e.target.files[0];
    setIsLoading(true);

    try {
      let imgRef = ref(storage, `images/${file.name}`);
      await uploadBytesResumable(imgRef, file);
      const url = await getDownloadURL(imgRef);
      setFileUrl(url);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    let data = {
      _id: new Date().getUTCMilliseconds(),
      name: name,
      title: title,
      cat: category.toLowerCase(),
      ingredients: ingredients,
      steps: steps,
      fileUrl: fileUrl,
    };

    const ref = collection(db, "recipes");

    try {
      await addDoc(ref, data);
      navigate("/");
      setTitle("");
      setCategory("");
      setIngredients("");
      setSteps("");
      setFileUrl("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCat = (e) => {
    console.log(e.target.value);
    setCategory(e.target.value);
  };

  return (
    <section className="post">
      {isLoading && (
        <div className="alert alert-success" role="alert">
          Please wait while we post your recipie :)
        </div>
      )}
      <form className="form" onSubmit={handleAdd}>
        <div className="form__heading">
          <h2 className="heading-secondary">Add your recipe</h2>
        </div>
        <div className="form__group">
          <label htmlFor="name" className="form__label">
            Username
          </label>
          <input
            type="text"
            className="form__input"
            placeholder="Enter a username of your choice"
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form__group">
          <label htmlFor="name" className="form__label">
            Recipe Name
          </label>
          <input
            type="text"
            className="form__input"
            placeholder="Name of your recipe"
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form__group">
          <label htmlFor="text" className="form__label">
            Category
          </label>
          <div className="form__select-container">
            <select
              name="cat"
              id="cat"
              className="form__select"
              onChange={handleCat}
            >
              <option value="default">Select</option>
              <option value="non-veg">Non-veg</option>
              <option value="veg">Veg</option>
            </select>
          </div>
          {/* <input
            type="text"
            className="form__input"
            placeholder="E.g. Non-veg"
            required
            onChange={(e) => setCategory(e.target.value)}
          /> */}
        </div>
        <div className="form__group">
          <label htmlFor="text" className="form__label">
            Ingredients
          </label>
          <TextEditor value={ingredients} onChange={setIngredients} />
        </div>
        <div className="form__group">
          <label htmlFor="text" className="form__label">
            Instructions
          </label>
          <TextEditor value={steps} onChange={setSteps} />
        </div>
        <div className="form__group">
          <label htmlFor="image" className="form__label">
            Recipe Image
          </label>
          <input
            type="file"
            className="form__input"
            required
            onChange={(e) => handleUpload(e)}
          />
        </div>

        <div className="form__group">
          <button type="submit" className="btn btn--green">
            Post Recipe
          </button>
        </div>
      </form>
    </section>
  );
};
export default Create;
