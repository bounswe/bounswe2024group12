import React from "react";
import Post from "./Post";
import SharePost from "./SharePost";

const Feed = () => {
  function getPosts() {
    fetch("/api/posts")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // const posts = getPosts();
  const posts = [
    {
      postHeader: "Hello World",
      postContent: "This is a post",
      postImage: "https://via.placeholder.com/200",
    },
    {
      postHeader: "Hello World",
      postContent: "This is a post",
      postImage: "https://via.placeholder.com/150",
    }
  ]
  


  return (
    <div>
      <SharePost />
      {posts.map((post) => (
        <Post post={post} />
      ))}
    </div>
  );
};

export default Feed;
