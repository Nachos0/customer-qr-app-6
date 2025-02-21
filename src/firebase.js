const FIREBASE_URL = "https://qrcodeapp-8d50d-default-rtdb.firebaseio.com/";

async function fetchData(endpoint, options = {}) {
    const response = await fetch(`${FIREBASE_URL}/${endpoint}.json`, options);
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Detailed Error Response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    if (response.status === 204) { // No content
        return null;
    }
     try {
        return await response.json();
    } catch (error) {
        console.error("Error parsing JSON:", error);
        throw new Error("Failed to parse server response.");
    }
}

export async function getCustomers() {
    try {
        const data = await fetchData("customers");
        if (!data) return [];
        return Object.entries(data).map(([key, value]) => ({ ...value, id: key }));
    } catch (error) {
        console.error("Error fetching customers:", error);
        return [];
    }
}

export async function getCustomer(id) {
    try {
        return await fetchData(`customers/${id}`);
    } catch (error) {
        console.error("Error fetching customer:", error);
        return null;
    }
}

export async function addCustomer(customer) {
    try {
        const response = await fetchData("customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customer),
        });
         if (response && response.name) {
            return { ...customer, id: response.name };
        } else {
            console.error("Unexpected response from Firebase:", response);
            throw new Error("Unexpected response from Firebase");
        }
    } catch (error) {
        console.error("Error adding customer:", error);
        throw error; // Re-throw the error so the calling function can handle it
    }
}

export async function updateCustomer(id, customer) {
    try {
        await fetchData(`customers/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customer),
        });
        return { ...customer, id };
    } catch (error) {
        console.error("Error updating customer:", error);
        return null;
    }
}

export async function deleteCustomer(id) {
    try {
        await fetchData(`customers/${id}`, { method: "DELETE" });
        return true;
    } catch (error) {
        console.error("Error deleting customer:", error);
        return false;
    }
}
