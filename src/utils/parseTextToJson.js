export const parseTextToJson = (text) => {
  try {
    const lines = text.split("\n");
    const json = {
      logo: "",
      booking_id: "",
      full_name: "",
      email: "",
      service_fee: [],
      workmanship: 0,
      total_amount: 0,
      maintenance_start_date: "N/A",
      maintenance_end_date: "N/A",
      message: "No message provided",
      change_part: false,
    };
    let currentService = null;
    lines.forEach((line) => {
      line = line.trim();
      if (line.startsWith("Logo: ")) json.logo = line.replace("Logo: ", "");
      if (line.startsWith("Booking ID: "))
        json.booking_id = line.replace("Booking ID: ", "");
      if (line.startsWith("Customer: ")) {
        const [name, email] = line.replace("Customer: ", "").split(" (");
        json.full_name = name;
        json.email = email ? email.replace(")", "") : "";
      }
      if (line.startsWith("Message: "))
        json.message = line.replace("Message: ", "");
      if (line.startsWith("Maintenance Start Date: "))
        json.maintenance_start_date = line.replace("Maintenance Start Date: ", "");
      if (line.startsWith("Maintenance End Date: "))
        json.maintenance_end_date = line.replace("Maintenance End Date: ", "");
      if (line.startsWith("Change Part: "))
        json.change_part = line.replace("Change Part: ", "") === "Yes";
      if (line.match(/^- /)) {
        currentService = { name: line.replace("- ", "").trim() };
        json.service_fee.push(currentService);
      }
      if (line.match(/Price: ₦/)) {
        currentService.price = parseFloat(
          line.replace("Price: ₦", "").replace(/,/g, "")
        );
      }
      if (line.match(/Qty: /)) {
        currentService.quantity = parseInt(line.replace("Qty: ", ""));
      }
      if (line.match(/Subtotal: ₦/)) {
        currentService.subtotal = parseFloat(
          line.replace("Subtotal: ₦", "").replace(/,/g, "")
        );
      }
      if (line.match(/Workmanship: ₦/)) {
        json.workmanship = parseFloat(
          line.replace("Workmanship: ₦", "").replace(/,/g, "")
        );
      }
      if (line.match(/Total: ₦/)) {
        json.total_amount = parseFloat(
          line.replace("Total: ₦", "").replace(/,/g, "")
        );
      }
    });
    return json;
  } catch (e) {
    console.error("Failed to parse text to JSON:", e);
    return null;
  }
};