import React, { useState } from "react";
import "../styles/App.css";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import data from "../mock/data.json";

// A constant that indicates how many posts will show per page.
const POSTS_PER_PAGE = 3;


function App() {
  const postData = data; // Store our data in a const variable
  const [selectedAuthor, setSelectedAuthor] = useState(null); // Set initial state to null
  const [currentPage, setCurrentPage] = useState(0); // Set initial state to 0

  // Retrieves all unique/distinct author names from the data to be used in the select options
  const uniqueAuthors = Array.from(new Set(postData.posts.map((post) => post.author.name))); 

  // Used to update selectedAuthor state when a new author is selected from the select options
  // selectedOption: the option the user has selected from the select options
  // setSelectedAuthor: updates the selectedAuthor state variable with the selectedOption that 
  // has been chosen
  // setCurrentPage: to reset the current page to the first page whenever a new author has been 
  // selected.
  const handleAuthorChange = (selectedOption) => {
    setSelectedAuthor(selectedOption); 
    setCurrentPage(0); 
  };

  // Used to update the current page (currentPage state) when the pagination button is clicked to 
  // navigate to a different page
  // selectedPage: the page that has been selected
  // setCurrentPage: updates the currentPage state variable with the selectedPage that has been 
  // chosen
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  // Used to store an array of posts that matches the selected author, else if 'Show All' is chosen, 
  // all posts will be stored
  const filteredPosts = selectedAuthor?.value
  ? postData.posts.filter((post) => post.author.name === selectedAuthor.value)
  : postData.posts;

  // Used to count the total number of pages needed for the pagination. It is counted based on 
  // the length of the filteredPosts (filteredPosts.length) divided by the number of 
  // posts per page (POSTS_PER_PAGE) rounded up to the nearest integer (Math.ceil). It is rounded 
  // up to ensure all posts will be displayed eventhough the last page may contain less than 3 
  // posts.
  const pageCount = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  // Used to count how many posts to skip to reach the beginning of the current page's post. It is 
  // counted by multiplying the currentPage and the POSTS_PER_PAGE, which results in a number 
  // representing the post index in the filteredPosts array. This means that the posts for 
  // currentPage starts with that index.
  const offset = currentPage * POSTS_PER_PAGE;

  // Used to store the posts that correspond to the current page being displayed in the pagination 
  // in the form of an array. It is calculated by using slice() to get the posts from filteredPosts 
  // starting from offset to offset + POSTS_PER_PAGE (exclusive).
  const currentPagePosts = filteredPosts.slice(offset, offset + POSTS_PER_PAGE);

  // Used to create the options for the select dropdown in the form of an array. It provides a list 
  // of authors for users to choose from.
  const authorOptions = [
    { value: "", label: "Show All" }, // Add "Show All" option with value of empty string
    ...uniqueAuthors.map((author) => ({ // For each author, it creates the value and label
      value: author,
      label: author,
    })),
  ];

  return (
    <main className="app-container">
      <header>
        <h2>Select an Author</h2>
        {/* Used to create a select dropdown to provide options on which author post you want to 
        see */}
        <Select
          value={selectedAuthor} // The current author selected
          onChange={handleAuthorChange} // Function to call whenever a different option is chosen
          options={authorOptions} // The list of available options to choose from
          isClearable // Provide an X button to clear selected author
          placeholder="Choose an author" // Text to be displayed on the select bar
          styles={{
            control: (provided, state) => ({
              ...provided, // Retain the default styles
              border: state.isFocused ? "2px solid #9000ff" : "2px solid gray", // If the border is clicked, change to 
                                                                                // purple, else gray
              boxShadow: state.isFocused ? "0 0 5px #9000ff" : "none", // If the border is clicked, create a purple 
                                                                        // shadow around the select bar
              "&:hover": {
                border: "2px solid #9000ff", // If hover on the select bar, the border will turn purple
              },
            }),
            option: (provided, state) => ({
              ...provided, // Retain the default styles
              background: state.isSelected ? "#9000ff" : "white", // Background colour for the options when selected, 
                                                                  // which will be purple, else will be white
              color: state.isSelected ? "white" : "black", // Text colour when option is selected, which will be 
                                                            // white, else will be black
              "&:hover": {
                background: "#CEA3FF", // Background colour for the options when on hover, which will be purple
              },
            }),
          }}
        />
      </header>

        {/* If currentPagePosts array is larger than 0, it will loop through the array for each post 
        in the array, creating individual articles displaying the author's name and avatar, along 
        with the title, summary, publish date and categories of the author. The publish date is 
        converted to a string after initializing it as a Date variable. Else, if the selected 
        author has no posts (which in our case is impossible as we loop through the posts to only 
        get authors from the posts), it will return a paragraph writing 'No Books Found For The 
        Selected Author' */}
        {currentPagePosts.length > 0 ? (
          <section>
            {currentPagePosts.map((post) => (
              <article key={post.id} className="post-container">
              <div className="author-info">
                <img src={post.author.avatar} alt={post.author.name} />
                <h3>{post.author.name}</h3>
              </div>
              <h4>{post.title}</h4>
              <time dateTime={post.publishDate}>
                Published: {new Date(post.publishDate).toLocaleDateString()}
              </time>
              <p>{post.summary}</p>
              <div className="categories">
                <h5>Categories:</h5>
                <ul>
                  {post.categories.map((category) => (
                    <li key={category.id}>{category.name}</li>
                  ))}
                </ul>
              </div>
            </article>
            ))}
          </section>
        ) : (
          <p>No books found for the selected author.</p>
        )}

        {/* If the length of the filteredPosts array is larger than POSTS_PER_PAGE, then it will 
        create a pagination, else, a pagination will not be created (when the number of posts to 
        be displayed on the page is less than POSTS_PER_PAGE) */}
        {filteredPosts.length > POSTS_PER_PAGE ? (
          <div className="pagination-container">
            <ReactPaginate
              previousLabel="Previous" // Text display for the previous button
              nextLabel="Next" // Text display for the next button
              breakLabel="..." // Text display for when there are any breaks in the pagination button
              pageCount={pageCount} // Total of pages to display
              onPageChange={handlePageChange} // Function to call whenever the page is changed
              containerClassName="pagination" // Class name for the container of the pagination 
              previousLinkClassName="pagination__link" // Class name for the previous page button
              nextLinkClassName="pagination__link" // Class name for the next page button
              disabledClassName="pagination__link--disabled" // Class name for when the previous 
                                                              // or next buttons are disabled 
                                                              // (when you are in the first or 
                                                              // last page)
              activeClassName="pagination__link--active" // Class name for when the previous and/or 
                                                          // next buttons are active or can be pressed
            />
          </div>
        ) : null}
    </main>
  );
}

export default App;
