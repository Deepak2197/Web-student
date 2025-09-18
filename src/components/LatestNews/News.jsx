import Item from "antd/es/list/Item";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {useState,useEffect} from "react"
import axiosInstance from "../../API/axiosConfig";
import { API_ENDPOINTS } from "../../ulits/apiConstant";

const News = ({ newzData, breadValue }) => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("id") || "4";

  //states for Api
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    getArticles();
  }, []);

  const getArticles = async () => {
    try {
      const res = await axiosInstance.post(
        API_ENDPOINTS.HOMEPAGE_INDEX.GET_HOME_NEWS_AI_NEWSARTICLE_V2,
        { user_id: userId }
      );
      //console.log(res?.data?.data)
      setArticles(res?.data?.data.filter((item) => item.type === "news"));
    } catch (err) {
      console.error("Error fetching articles:", err);
    }
  }

  const handleLike = async (aid, type, status,isAi) => {
    //console.log("liked")
    if(isAi==2){
      setArticles((prev) =>
      prev.map((article) =>
        article.id === aid
          ? { ...article, user_like: status === 1 ? 0 : 1 }
          : article
      )
    );

    // API call
    try {
      await axiosInstance.post(
        API_ENDPOINTS.NEWS_AND_ARTICLES.LIKE_AND_BOOKMARK_STATUS,
        {
          user_id: userId,
          article_id: aid,
          is_liked: status === 1 ? "0" : "1",
          type,
        }
      );
    } catch (err) {
      console.error("Like error:", err);
      // Revert on error
      setArticles((prev) =>
        prev.map((article) =>
          article.id === aid ? { ...article, is_liked: status } : article
        )
      );
    }
    }else{
      setArticles((prev) =>
      prev.map((article) =>
        article.id === aid
          ? { ...article, is_liked: status === 1 ? 0 : 1 }
          : article
      )
    );
      await axiosInstance.post(API_ENDPOINTS.NEWS_AND_ARTICLES.LIKE_AND_BOOKMARK_STATUS, {
        user_id: userId,
        id:aid,
        is_liked: status === 1 ? "0" : "1",
        type: type,
        isAi: "1",
      });
    }
    // Optimistic UI update
  
  }


  const formatSecondsToDate = (seconds) => {
    if (seconds) {
      // Create a new Date object using the seconds
      const date = new Date(Number(seconds));

      // Define options for formatting the date
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      // Format the date
      const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
        date
      );

      // Return the formatted date string
      return formattedDate;
    }
  };


  const newsLatestFilter = articles
    ?.slice()
    ?.sort((a, b) => Number(b.creation_date) - Number(a.creation_date));
  const news = newsLatestFilter?.slice(0, breadValue);

  const slugify = (title) => {
    return encodeURIComponent(title)
      .replace(/%20/g, "-") // spaces → dashes
      .replace(/%3A/g, "_") // colon → dash
      .replace(/%26/g, "and") // & → and
      .replace(/%27/g, "") // apostrophe → remove
      .replace(/%2F/g, "-") // slash → dash (optional)
      .replace(/%/g, "") // final safety net
      // .replace(/:/g, "_") // final safety net
  };
  return (
    <div className={userId == 4 ? "newsBG" : ""}>
      <div className={userId == 4 ? "container" : ""}>
        <div className="row">
          <div className="md-12">
            <div
              className={`newNewsPartician ${
                userId === "4" ? "newNewsPartician1" : ""
              }`}
            >
              <div className="headinGSystem ">
                <h2>News</h2>
                <span
                  className="seeAll newseebtn"
                  style={{
                    cursor: "pointer",
                    textTransform: "capitalize",
                    fontWeight: 500,
                    color: "#007aff",
                    fontSize: "16px",
                  }}
                  onClick={() => navigate(`/News`)}
                >
                  See all
                </span>
              </div>
              <div className="newSPart" style={{ cursor: "pointer" }}>
                {news?.map((news, i) => (
                  <div
                    key={i}
                    className="newSBox"
                    
                  >
                    <div className="newSPic">
                      <img
                      onClick={() => {
                      if (news?.slug != undefined) {
                        navigate(`/article-news/${news.slug}`);
                      } else {
                        navigate(`/news-article/news=${slugify(news.title)}`);
                      }
                    }}
                        src={news?.image == null ? `${window.IMG_BASE_URL}/dams-icon/news.png` : news.image}
                      />
                    </div>
                    <div className="newSText">
                      <h2 onClick={() => {
                      if (news?.slug != undefined) {
                        navigate(`/article-news/${news.slug}`);
                      } else {
                        navigate(`/news-article/news=${slugify(news.title)}`);
                      }
                    }} >{news?.title}</h2>
                      <div className="newsBotomtext">
                        <div className="dateSec">
                          <p>{formatSecondsToDate(news.creation_date)}</p>
                        </div>
                        <ul>
                          <li className="thumb">
                            {news.isAi==2? <img
                              src={
                               news?.user_like == 1
                               ? `${window.IMG_BASE_URL}/emdpublic/dailycases/likes.svg`
                               : `${window.IMG_BASE_URL}/emdpublic/dailycases/like.svg `
                               
                              }
                              onClick={() =>{
                                handleLike(
                                  news?.id,
                                  news?.type,
                                  news?.is_liked,
                                  news?.isAi
                                )

                              }
                              }
                              alt="likes"
                              style={{ marginRight: "5px" }}
                            /> :<img
                              src={
                               news?.is_liked == 1
                               ? `${window.IMG_BASE_URL}/emdpublic/dailycases/likes.svg`
                               : `${window.IMG_BASE_URL}/emdpublic/dailycases/like.svg `
                               
                              }
                              onClick={() =>{
                                handleLike(
                                  news?.id,
                                  news?.type,
                                  news?.is_liked,
                                  news?.isAi
                                )

                              }
                              }
                              alt="likes"
                              style={{ marginRight: "5px" }}
                            /> }
                          </li>
                          <li className="heart">
                            {news?.is_bookmarked == 0 ? (
                              <FaHeart color="gray" size={16} />
                            ) : (
                              <span>
                                <FaHeart color="#FF1E1E" size={16} />
                                &nbsp;
                              </span>
                            )}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
