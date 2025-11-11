import express from "express";
import axios from "axios";

const app = express();

const name = "John Doe";
const regNo = "REG12347"; 
const email = "john@example.com";

const generateWebhookUrl = "https://bfhldevapigw.healthrx.co.in/hiring/generateWebhook/JAVA";
const submitUrl = "https://bfhldevapigw.healthrx.co.in/hiring/testWebhook/JAVA";

function getFinalSQL(regNo) {
  const digits = regNo.replace(/\D/g, "");
  const lastTwo = parseInt(digits.slice(-2));
  const isOdd = lastTwo % 2 === 1;

  if (isOdd) {
    return `SELECT department_id, COUNT(*) AS total_employees
            FROM employees
            GROUP BY department_id
            HAVING COUNT(*) > 5;`;
  }
  else {
      return `SELECT customer_id, SUM(order_amount) AS total_spent
            FROM orders
            GROUP BY customer_id
            ORDER BY total_spent DESC;`;
  }
}

(async () => {
  try {
    console.log("staring from herre");

    const genRes = await axios.post(generateWebhookUrl, { name, regNo, email });
    const { webhook, accessToken } = genRes.data;
    console.log("Webhook generated:", webhook);

    const finalQuery = getFinalSQL(regNo);
    console.log(" Final SQL Query:\n", finalQuery);

    const submitRes = await axios.post(
      submitUrl,
      { finalQuery },
      { headers: { Authorization: accessToken, "Content-Type": "application/json" } }
    );

    console.log("Submission Successful!");
    console.log("Server Response:", submitRes.data);
  } catch (err) {
    console.error("Error:", err.response?.data ||  err.message);
  }
})();

app.listen(8080, () => console.log("App running (no endpoints used)"));
