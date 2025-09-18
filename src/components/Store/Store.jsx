import React, { useEffect } from "react";
import "../../assets/css/ecommerce/responsive.css";
import "../../assets/css/ecommerce/style.css";

function Store() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  return <section className="book-mod-page"></section>;
}
export default Store;
