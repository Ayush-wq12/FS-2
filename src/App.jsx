import { useState } from "react";
function Postin() {
  const [content , setContent] = useState("");
  
  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your post here..."
      />
    </div>
  );
}
function useForm() {
  const [formData, setFormData] = useState({
    title: "Social media post composer",
    content: "Enter your post content here : ",
  });
  if(formData.content.length > 280){
    alert("Content exceeds 280 characters limit!");
  }
}
const limits={
  twitter: 280,
  linkedin:400
};
if(formData.content.length > limits.twitter){
  showError("Content exceeds Twitter's 280 characters limit!");
}
const strategies={
  twitter: 
}

export default App;