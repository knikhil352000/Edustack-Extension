/* global chrome */
import React, { useEffect, useState } from "react";
import EdustackImage from "../images/LogoTextMark.svg";
import "./App.css";

const App = () => {
  const [linkArray, setLinkArray] = useState([]);
  const [activeLink, setActiveLink] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [addLink, setAddLink] = useState(false);
  const addLinkHandler = () => {
    setAddLink(true);
    const queryInfo = { active: true, lastFocusedWindow: true };
    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        const url = tabs[0].url;
        setActiveLink(url);
      });
  };
  const onSaveLinkHandler = () => {
    setAddLink(false);
    setLinkArray((prev) => [
      ...prev,
      { id: Math.random().toString(), title: linkTitle, link: activeLink },
    ]);
    setActiveLink("");
    setLinkTitle("");
  };

  const deleteLinkHandler = (id) => {
    const temp = linkArray.filter((e) => e.id !== id);
    setLinkArray(temp);
  };

  useEffect(() => {
    if (localStorage.getItem("edustack-links") === null) {
      setLinkArray([]);
    } else {
      setLinkArray(JSON.parse(localStorage.getItem("edustack-links")));
    }
  }, []);
  useEffect(() => {
    if (linkArray.length > 0) {
      localStorage.setItem("edustack-links", JSON.stringify(linkArray));
    }
  }, [linkArray]);
  return (
    <div className="extension">
      <div className="extension_heading">
        <img src={EdustackImage} alt="" />
      </div>
      <div className="extension_content">
        {linkArray.length === 0 && activeLink === "" && (
          <p className="empty_message">
            Please click on Add button to add Link
          </p>
        )}
        {addLink && (
          <div className="input_field">
            <input
              onChange={(e) => setLinkTitle(e.target.value)}
              placeholder="Enter the link title"
              type="text"
            />
            <p>{activeLink}</p>
          </div>
        )}
        <div className="button_container">
          {addLink ? (
            <button
              disabled={linkTitle === ""}
              className="add_button"
              onClick={onSaveLinkHandler}
            >
              Save Link
            </button>
          ) : (
            <button className="add_button" onClick={addLinkHandler}>
              Add Link
            </button>
          )}
          <button disabled={linkArray.length === 0} className="add_button">
            Send To App
          </button>
        </div>
        {linkArray.length > 0 && (
          <>
            <h3 className="saved_link">Saved</h3>
            <div className="all_links">
              {linkArray.map((e) => (
                <>
                  <h4 className="link_title">{e.title}</h4>
                  <div className="link_container">
                    <p className="links">{e.link}</p>
                    <div
                      className="delete_link"
                      onClick={() => deleteLinkHandler(e.id)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        data-testid="DeleteIcon"
                      >
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                      </svg>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </>
        )}
        {/* <button className="add_button">Send To Classroom</button> */}
      </div>
    </div>
  );
};

export default App;
