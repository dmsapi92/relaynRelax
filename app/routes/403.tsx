import { Button } from "@nextui-org/button";
import { Link } from "@remix-run/react";

export default function PermissionDenied() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
        403 - Permission Denied
      </h1>
      <p style={{ fontSize: "24px", marginBottom: "30px" }}>
        You do not have permission to access this page.
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
