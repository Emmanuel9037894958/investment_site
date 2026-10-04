const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const path = require("path");

const serviceAccount = require(
  path.join(__dirname, "firebase-service-account.json")
);

initializeApp({
  credential: cert(serviceAccount),
});

const ADMIN_UID = "o5I86Wvh63WvUthlqgADpNTgmNt2";

async function setAdmin() {
  try {
    await getAuth().setCustomUserClaims(ADMIN_UID, {
      admin: true,
    });

    console.log("✅ Administrator privileges granted successfully.");
    console.log("Admin UID:", ADMIN_UID);
    console.log("Claim: admin = true");

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to set administrator privileges:");
    console.error(error);
    process.exit(1);
  }
}

setAdmin();