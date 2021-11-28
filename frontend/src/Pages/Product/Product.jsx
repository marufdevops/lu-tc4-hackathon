import React, { useEffect, useState } from "react";
import styles from "./Product.module.css";
import Topbar from "../../Components/Topbar/Topbar";
import productPic from "./ps5.jpg";
import { Typography, Grid, Button } from "@mui/material";
import profile from "./profile.png";
import axios from "../../Helper/axios";
import Cookies from "universal-cookie";
import { useHistory } from "react-router";
import ps5 from "./ps5.jpg";
let cookies = new Cookies();
const Product = (props) => {
  const [response, setResponse] = useState({});
  const [userId, setUserId] = useState("");
  const [bid, setBid] = useState({});
  const [dateDiff, setDateDiff] = useState("");
  let history = useHistory();
  useEffect(() => {
    axios
      .get(`/api/products/${props.match.params.prod}`)
      .then((res) => {
        setResponse(res.data.data.product);
        setUserId(res.data.data.userId);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (response.auctionDeadline) {
      const lastDay = parseInt(response.auctionDeadline.split("/")[0]);
      const lastMonth = parseInt(response.auctionDeadline.split("/")[1]);
      const lastYear = parseInt(response.auctionDeadline.split("/")[2]);
      const year = parseInt(new Date().getFullYear());
      const month = parseInt(new Date().getMonth());
      const day = parseInt(new Date().getDay());
      const yearDiff = lastYear - year;
      const monthDiff = lastMonth - month;
      const dayDiff = lastDay - day;
      if (yearDiff > 0) {
        yearDiff > 1
          ? setDateDiff(`${yearDiff} years left`)
          : setDateDiff(`${yearDiff} year left`);
      } else if (monthDiff > 0) {
        monthDiff > 1
          ? setDateDiff(`${monthDiff} months left`)
          : setDateDiff(`${monthDiff} month left`);
      } else if (dayDiff > 0) {
        dayDiff > 1
          ? setDateDiff(`${dayDiff} days left `)
          : setDateDiff(`${dayDiff} day left `);
      } else if (dayDiff == 0) {
        setDateDiff("Last Day");
      } else {
        setDateDiff("Time's Up");
      }
    }
  }, [response]);

  const handleBidChange = (event) => {
    setBid(event.target.value);
  };
  const placeBid = () => {
    if (bid <= response.bids[response.bids.length - 1].bid) {
      alert("Your bid can't be lower than current bid");
    } else {
      const body = {
        bid,
      };
      axios
        .post(`/api/products/${props.match.params.prod}`, body)
        .then((res) => {
          console.log(res);
          alert("Bid accepted");
        })
        .catch((err) => {
          console.log(err);
          alert("Bidding Failed");
        });
    }
  };

  return (
    <div>
      {cookies.get("bargainc") ? (
        <Topbar
          list={[
            {
              link: "profile",
              base: <img className={styles.profileImage} src={profile}></img>,
              type: "image",
            },
          ]}
        />
      ) : (
        <Topbar
          list={[
            { link: "login", base: "Login" },
            { link: "signUp", base: "Sign Up" },
          ]}
        />
      )}
      <Grid
        container
        spacing={8}
        justifyContent="flex-start"
        className={styles.gridContainer}
      >
        <Grid item xs={8} sm={6} md={3}>
          <div className={styles.productInfo1}>
            <img className={styles.productImg} src={ps5} alt="" />
          </div>
        </Grid>

        <Grid item xs={8} sm={6} md={8.65}>
          {response.bids ? (
            <>
              <h1 style={{ textAlign: "left" }}>{response.productName}</h1>
              <hr style={{ borderTop: "1px solid #40B8E5" }}></hr>
              <Typography
                className={styles.infoTitle}
                gutterBottom
                variant="h5"
                component="div"
              >
                Category:{" "}
                {response.category
                  ? response.category.split("-")[0].charAt(0).toUpperCase() +
                    response.category.split("-")[0].slice(1) +
                    " & " +
                    response.category.split("-")[1].charAt(0).toUpperCase() +
                    response.category.split("-")[1].slice(1)
                  : null}
              </Typography>
              <Typography
                className={styles.infoTitle}
                gutterBottom
                variant="h5"
                component="div"
              >
                Condition: New
              </Typography>
              <Typography
                className={styles.infoTitle}
                gutterBottom
                variant="h5"
                component="div"
              >
                Time Left: {dateDiff}
              </Typography>
              <hr style={{ borderTop: "1px solid #40B8E5" }}></hr>
              <Typography
                className={styles.infoTitle}
                gutterBottom
                variant="h5"
                component="div"
              >
                Current Bid: $ {response.bids[response.bids.length - 1].bid}
              </Typography>
              <div>
                <input
                  className={styles.placeBid}
                  onChange={(event) => {
                    handleBidChange(event);
                  }}
                />{" "}
                {response.allBids.includes(userId) ? (
                  <button disabled className={styles.bidButton}>
                    Place Bid
                  </button>
                ) : (
                  <button onClick={placeBid} className={styles.bidButton}>
                    Place Bid
                  </button>
                )}
              </div>
              <p style={{ margin: "10px 0 10px 0" }}>OR</p>
              <div>
                <input className={styles.placeBid} />{" "}
                <button className={styles.bidButton}>BUY NOW</button>
              </div>
            </>
          ) : null}
        </Grid>
      </Grid>
      <div className={styles.description}>
        <h3>Product Description </h3>
        {response.productDetails}
      </div>
    </div>
  );
};

export default Product;

function getDifferenceInDays(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / (1000 * 60 * 60 * 24);
}

function getDifferenceInHours(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / (1000 * 60 * 60);
}

function getDifferenceInMinutes(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / (1000 * 60);
}

function getDifferenceInSeconds(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / 1000;
}