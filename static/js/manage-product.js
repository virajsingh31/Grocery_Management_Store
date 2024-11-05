// Assuming productSaveApiUrl is defined somewhere
const productSaveApiUrl = '/add-product';
   $("#saveProduct").on("click", function () {
    console.log("Save button clicked");  // Add this for debugging
    var data = $("#productForm").serializeArray();
    var requestPayload = {
        product_name: null,
        uom_id: null,
        price_per_unit: null
    };

    // Build the request payload
    for (var i = 0; i < data.length; ++i) {
        var element = data[i];
        switch (element.name) {
            case 'name':
                requestPayload.product_name = element.value;
                break;
            case 'uom':
                requestPayload.uom_id = element.value;
                break;
            case 'price':
                requestPayload.price_per_unit = element.value;
                break;
        }
    }

    // Log the request payload to make sure it looks correct
    console.log("Request Payload:", requestPayload);

    // Call API to save the product
    $.ajax({
        url: productSaveApiUrl,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(requestPayload),  // Send data as JSON
        success: function (response) {
            // Handle success
            console.log("Response:", response);  // Log the response from the server
            alert('Product saved successfully with ID: ' + response.product_id);
            $('#productModal').modal('hide');  // Close the modal
            refreshProductList();  // Call a function to refresh the product list
        },
        error: function (xhr, status, error) {
            // Handle errors
            console.log("Error:", error);  // Log the error message for debugging
            alert('Error: ' + xhr.responseJSON.message);  // Assuming your server returns a message
        }
    });
});


    // Function to refresh the product list
    function refreshProductList() {
        $.get(productListApiUrl, function (response) {
            if (response) {
                var table = '';
                $.each(response, function (index, product) {
                    table += '<tr data-id="' + product.product_id + '" data-name="' + product.name + '" data-unit="' + product.uom_id + '" data-price="' + product.price_per_unit + '">' +
                        '<td>' + product.name + '</td>' +
                        '<td>' + product.uom_name + '</td>' +
                        '<td>' + product.price_per_unit + '</td>' +
                        '<td><span class="btn btn-xs btn-danger delete-product">Delete</span></td></tr>';
                });
                $("table").find('tbody').empty().html(table);
            }
        });
    }

    // Clear form on modal hide
    productModal.on('hide.bs.modal', function () {
        $("#id").val('0');
        $("#name, #price").val('');  // Resetting other fields
        $("#uoms").val('');  // Resetting the unit of measure select
        productModal.find('.modal-title').text('Add New Product');
    });

    // On clicking the save button
    $('#saveProduct').click(function() {
        const name = $('#name').val();
        const unit = $('#uom').val();  // Ensure you have options in your select for units
        const price = $('#price').val();

        // Perform validation here if needed

        $.ajax({
            url: '/add-product',  // The endpoint where the request will be sent
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: name,
                unit: unit,
                price: price
            }),
            success: function(response) {
                alert(response.message);  // Show success message
                // Optionally, you can refresh the product list or reset the form here
                $('#productModal').modal('hide');  // Close the modal
            },
            error: function(xhr, status, error) {
                alert('Error: ' + xhr.responseJSON.message);  // Handle errors
            }
        });
    });
});
