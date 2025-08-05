import { Button } from "@nextui-org/button";
import { Link } from "@remix-run/react";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
        404 - Page Not Found
      </h1>
      <p style={{ fontSize: "24px", marginBottom: "30px" }}>
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/">
        <Button>Go to Home</Button>
      </Link>
      <Link to="/about" style={{ marginLeft: "10px" }}>
        <Button>About Us</Button>
      </Link>
    </div>
  );
}
