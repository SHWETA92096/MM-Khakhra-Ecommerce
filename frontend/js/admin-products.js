// ==========================================
// ADMIN PRODUCT MANAGEMENT
// ==========================================

// CHECK LOGIN
const storedUser = localStorage.getItem("user");

if (!storedUser) {
    alert("🔐 Please login first.");
    window.location.href = "login.html";
}

const user = JSON.parse(storedUser);

if (user.role !== "admin") {
    alert("❌ Admin access required.");
    window.location.href = "index.html";
}


// ==========================================
// API URL
// ==========================================

const API_URL = "http://192.168.0.104:5000/api/products";


// ==========================================
// ELEMENTS
// ==========================================

const productModal =
    document.getElementById("productModal");

const productForm =
    document.getElementById("addProductForm");

const productTable =
    document.getElementById("productsTable");


// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadProducts() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        const products = await response.json();

        productTable.innerHTML = "";

        if (products.length === 0) {

            productTable.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;">
                        No products found.
                    </td>
                </tr>
            `;

            return;
        }


        products.forEach(product => {

            const imagePath =
                product.image
                    ? `http://192.168.0.104:5000/uploads/${product.image}`
                    : "images/logo.png";


            productTable.innerHTML += `

                <tr>

                    <td>

                        <img
                            class="product-image"
                            src="${imagePath}"
                            alt="${product.name}"
                            onerror="this.src='images/logo.png'"
                        >

                    </td>


                    <td>
                        <strong>
                            ${product.name}
                        </strong>
                    </td>


                    <td>
                        ${product.flavor}
                    </td>


                    <td>
                        ${product.weight}
                    </td>


                    <td>
                        ₹${product.price}
                    </td>


                    <td>
                        ${product.stock ?? 0}
                    </td>


                    <td>

                        <button
                            class="action-btn edit-btn"
                            onclick="editProduct('${product._id}')"
                            title="Edit Product">

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            class="action-btn delete-btn"
                            onclick="deleteProduct('${product._id}')"
                            title="Delete Product">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </td>

                </tr>

            `;

        });

    }

    catch (error) {

        console.error(
            "Load Products Error:",
            error
        );

        productTable.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align:center;color:red;">

                    ❌ Unable to load products.

                </td>

            </tr>

        `;

    }

}


// ==========================================
// OPEN ADD PRODUCT MODAL
// ==========================================

function addProduct() {

    productForm.reset();

    delete productForm.dataset.editId;

    document.querySelector(
        ".modal-header h2"
    ).innerHTML =
        "➕ Add New Product";


    document.querySelector(
        ".save-product-btn"
    ).innerHTML =
        '<i class="fa-solid fa-plus"></i> Add Product';


    document
        .getElementById("productModal")
        .classList.add("active");

}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeProductModal() {

    document
        .getElementById("productModal")
        .classList.remove("active");

}


// ==========================================
// ADD / EDIT PRODUCT
// ==========================================

productForm.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();


        // ==================================
        // GET VALUES
        // ==================================

        const name =
            document
                .getElementById("productName")
                .value
                .trim();


        const flavor =
            document
                .getElementById("productFlavor")
                .value
                .trim();


        const weight =
            document
                .getElementById("productWeight")
                .value
                .trim();


        const shape =
            document
                .getElementById("productShape")
                .value
                .trim();


        const price =
            document
                .getElementById("productPrice")
                .value;


        const stock =
            document
                .getElementById("productStock")
                .value;


        const description =
            document
                .getElementById("productDescription")
                .value
                .trim();


        const imageInput =
            document
                .getElementById("productImage");


        const image =
            imageInput.files[0];


        // ==================================
        // VALIDATION
        // ==================================

        if (!name) {
            alert("Please enter product name.");
            return;
        }


        if (!flavor) {
            alert("Please enter flavour.");
            return;
        }


        if (!weight) {
            alert("Please enter weight.");
            return;
        }


        if (!shape) {
            alert("Please select shape.");
            return;
        }


        if (
            price === "" ||
            Number(price) < 0
        ) {

            alert("Please enter a valid price.");
            return;

        }


        if (
            stock === "" ||
            Number(stock) < 0
        ) {

            alert("Please enter valid stock.");
            return;

        }


        if (!description) {

            alert(
                "Please enter product description."
            );

            return;

        }


        // ==================================
        // EDIT MODE
        // ==================================

        const editId =
            productForm.dataset.editId;


        // ==================================
        // IMAGE VALIDATION
        // ==================================

        // Image is REQUIRED only when adding
        // a new product.

        if (!editId && !image) {

            alert(
                "Please select a product image."
            );

            return;

        }


        if (image) {

            if (
                image.size >
                5 * 1024 * 1024
            ) {

                alert(
                    "Image must be less than 5 MB."
                );

                return;

            }

        }


        // ==================================
        // CREATE FORMDATA
        // ==================================

        const formData =
            new FormData();


        formData.append(
            "name",
            name
        );


        formData.append(
            "flavor",
            flavor
        );


        formData.append(
            "weight",
            weight
        );


        formData.append(
            "shape",
            shape
        );


        formData.append(
            "price",
            price
        );


        formData.append(
            "stock",
            stock
        );


        formData.append(
            "description",
            description
        );


        // Add image only if selected

        if (image) {

            formData.append(
                "image",
                image
            );

        }


        // ==================================
        // BUTTON
        // ==================================

        const button =
            document.querySelector(
                ".save-product-btn"
            );


        button.disabled = true;


        if (editId) {

            button.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Updating...';

        }

        else {

            button.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Adding...';

        }


        // ==================================
        // API REQUEST
        // ==================================

        try {

            let response;


            // ==================================
            // UPDATE
            // ==================================

            if (editId) {

                response =
                    await fetch(
                        `${API_URL}/${editId}`,
                        {

                            method: "PUT",

                            body: formData

                        }
                    );

            }

            // ==================================
            // ADD
            // ==================================

            else {

                response =
                    await fetch(
                        API_URL,
                        {

                            method: "POST",

                            body: formData

                        }
                    );

            }


            const data =
                await response.json();


            // ==================================
            // SUCCESS
            // ==================================

            if (response.ok) {

                if (editId) {

                    alert(
                        "✅ Product updated successfully!"
                    );

                }

                else {

                    alert(
                        "🎉 Product added successfully!"
                    );

                }


                productForm.reset();

                delete productForm.dataset.editId;


                closeProductModal();


                loadProducts();

            }

            else {

                alert(
                    "❌ " +
                    (
                        data.message ||
                        "Something went wrong."
                    )
                );

            }

        }

        catch (error) {

            console.error(
                "Product Save Error:",
                error
            );


            alert(
                "❌ Unable to connect to backend.\n\nMake sure your Node.js server is running on port 5000."
            );

        }


        // ==================================
        // RESET BUTTON
        // ==================================

        button.disabled = false;


        button.innerHTML =
            '<i class="fa-solid fa-plus"></i> Add Product';

    }
);


// ==========================================
// EDIT PRODUCT
// ==========================================

async function editProduct(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`
            );


        const product =
            await response.json();


        if (!response.ok) {

            alert(
                product.message ||
                "Unable to load product."
            );

            return;

        }


        // ==================================
        // FILL FORM
        // ==================================

        document.getElementById(
            "productName"
        ).value =
            product.name || "";


        document.getElementById(
            "productFlavor"
        ).value =
            product.flavor || "";


        document.getElementById(
            "productWeight"
        ).value =
            product.weight || "";


        document.getElementById(
            "productShape"
        ).value =
            product.shape || "";


        document.getElementById(
            "productPrice"
        ).value =
            product.price ?? "";


        document.getElementById(
            "productStock"
        ).value =
            product.stock ?? 0;


        document.getElementById(
            "productDescription"
        ).value =
            product.description || "";


        // ==================================
        // STORE EDIT ID
        // ==================================

        productForm.dataset.editId = id;


        // ==================================
        // CHANGE MODAL TITLE
        // ==================================

        document.querySelector(
            ".modal-header h2"
        ).innerHTML =
            "✏️ Edit Product";


        // ==================================
        // CHANGE BUTTON
        // ==================================

        document.querySelector(
            ".save-product-btn"
        ).innerHTML =
            '<i class="fa-solid fa-save"></i> Update Product';


        // ==================================
        // IMAGE IS OPTIONAL WHILE EDITING
        // ==================================

        document.getElementById(
            "productImage"
        ).removeAttribute("required");


        // ==================================
        // OPEN MODAL
        // ==================================

        productModal.classList.add("active");

    }

    catch (error) {

        console.error(
            "Edit Product Error:",
            error
        );

        alert(
            "❌ Unable to load product."
        );

    }

}


// ==========================================
// DELETE PRODUCT
// ==========================================

async function deleteProduct(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (response.ok) {

            alert(
                "🗑️ Product deleted successfully!"
            );

            loadProducts();

        }

        else {

            alert(
                "❌ " +
                (
                    data.message ||
                    "Failed to delete product."
                )
            );

        }

    }

    catch (error) {

        console.error(
            "Delete Product Error:",
            error
        );

        alert(
            "❌ Unable to connect to server."
        );

    }

}


// ==========================================
// CLOSE MODAL OUTSIDE
// ==========================================

productModal.addEventListener(
    "click",
    function (e) {

        if (e.target === productModal) {

            closeProductModal();

        }

    }
);


// ==========================================
// LOAD PRODUCTS
// ==========================================

loadProducts();