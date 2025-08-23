document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('productModal');
    const overlay = document.getElementById('modal-overlay');
    
    // Check if modal elements exist
    if (!modal || !overlay) {
        console.warn('Product modal elements not found');
        return;
    }
    
    const closeBtn = modal.querySelector('.close-modal');

    document.querySelectorAll('.open-modal-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const handle = btn.dataset.productHandle;
        try {
          const res = await fetch(`/products/${handle}.js`);
          if (!res.ok) throw new Error('Product not found');
          const product = await res.json();
          const addToCartBtn = document.querySelector('#modal-base-bottom button');

          addToCartBtn.addEventListener('click', async () => {
            const selectedColor = document.querySelector('.color-option-container.selected .color-option')?.dataset
              .color;
            const selectedSize = document.getElementById('size-select').value;

            if (!selectedColor || !selectedSize) {
              alert('Please select color and size');
              return;
            }

            // Find the variant id
            const variant = product.variants.find((v) => v.option1 === selectedSize && v.option2 === selectedColor);

            if (!variant) {
              alert('Selected variant is not available');
              return;
            }

            // Add main product
            await fetch('/cart/add.js', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: variant.id, quantity: 1 }),
            });

              // Bonus product logic
              // Check if the selected color is black and size is M
              // if so, add the bonus product : soft-winter-jacket
              // the handle in the imported data is dark-winter-jacket not soft-winter-jacket
            if (selectedColor.toLowerCase() === 'black' && selectedSize.toLowerCase() === 'm') {
              // the handle in the imported data is dark-winter-jacket not soft-winter-jacket
              const bonusProductHandle = 'dark-winter-jacket';
              const bonusRes = await fetch(`/products/${bonusProductHandle}.js`);
              const bonusProduct = await bonusRes.json();
              const bonusVariantId = bonusProduct.variants[0].id; // assume first variant
              await fetch('/cart/add.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: bonusVariantId, quantity: 1 }),
              });
            }

            alert('Added to cart!');
            // Fetch cart contents to view in console
            fetch('/cart.js')
              .then((res) => res.json())
              .then((cart) => {
                console.log(cart);
                // cart.items is an array of products in the cart
                cart.items.forEach((item) => {
                  console.log(`Product: ${item.title}`);
                  console.log(`Variant: ${item.variant_title}`);
                  console.log(`Quantity: ${item.quantity}`);
                  console.log(`Price: ${(item.price / 100).toFixed(2) + Shopify.currency.active}`);
                  console.log('---');
                });
              })
              .catch((err) => console.error(err));
          });

          // Inject product data
          document.getElementById('modal-title').textContent = product.title;
          document.getElementById('modal-price').textContent =
            (product.price / 100).toFixed(2).replace('.', ',') + Shopify.currency.active;
          document.getElementById('modal-description').innerHTML = product.description;
          document.getElementById('modal-image').src = product.images[0] || '';

          // Populate color and size options
          populateVariantOptions(product);

          // Helper function to get color value
          function getColorValue(colorName) {
            const colorMap = {
              red: '#ff0000',
              blue: '#0000ff',
              green: '#008000',
              black: '#000000',
              white: '#ffffff',
              yellow: '#ffff00',
              pink: '#ffc0cb',
              purple: '#800080',
              orange: '#ffa500',
              brown: '#a52a2a',
              gray: '#808080',
              grey: '#808080',
            };
            return colorMap[colorName.toLowerCase()] || '#000000';
          }

          function populateVariantOptions(product) {
            const colorContainer = document.getElementById('color-options');
            const sizeSelect = document.getElementById('size-select');

            // Clear existing options
            colorContainer.innerHTML = '';
            sizeSelect.innerHTML = '<option value="" disabled selected>Choose your size</option>';

            // Extract unique colors and sizes from variants
            const colors = new Set();
            const sizes = new Set();

            product.variants.forEach((variant) => {
              if (variant.option1) sizes.add(variant.option1);
              if (variant.option2) colors.add(variant.option2);
            });

            // Create color options (assuming second option is color)
            const colorsArray = Array.from(colors);
            colorContainer.style.setProperty('--total-colors', colorsArray.length);

            colorsArray.forEach((color, index) => {
              const colorDiv = document.createElement('div');
              colorDiv.className = 'color-option-container';
              const colorDivBorder = document.createElement('div');
              colorDivBorder.className = 'color-option-border';
              const colorDivName = document.createElement('div');
              colorDivName.className = 'color-option';
              colorDivName.textContent = color;
              colorDivName.dataset.color = color;
              colorDivName.dataset.index = index;

              // Set the color for the left border
              const colorValue = getColorValue(color);
              colorDiv.style.setProperty('--option-color', colorValue);
              colorDiv.appendChild(colorDivBorder);
              colorDiv.appendChild(colorDivName);

              colorDiv.addEventListener('click', () => {
                document
                  .querySelectorAll('.color-option-container.selected')
                  .forEach((el) => el.classList.remove('selected'));

                colorDiv.classList.add('selected');

                // Add has-selection class and set selected index
                colorContainer.classList.add('has-selection');
                colorContainer.style.setProperty('--selected-index', index);
              });
              colorContainer.appendChild(colorDiv);
            });

            // Create size options for both select and custom dropdown
            const dropdownOptions = document.getElementById('dropdown-options');
            dropdownOptions.innerHTML = ''; // Clear existing options

            sizes.forEach((size) => {
              // Create option for hidden select (for form submission)
              const option = document.createElement('option');
              option.value = size;
              option.textContent = size;
              sizeSelect.appendChild(option);

              // Create option for custom dropdown
              const dropdownOption = document.createElement('div');
              dropdownOption.className = 'dropdown-option';
              dropdownOption.textContent = size;
              dropdownOption.dataset.value = size;

              dropdownOption.addEventListener('click', () => {
                // Update selected text
                document.querySelector('.selected-text').textContent = size;

                // Update hidden select value
                sizeSelect.value = size;

                // Remove selected class from all options
                document.querySelectorAll('.dropdown-option').forEach((opt) => opt.classList.remove('selected'));

                // Add selected class to clicked option
                dropdownOption.classList.add('selected');

                // Close dropdown
                document.querySelector('.custom-dropdown').classList.remove('open');
              });

              dropdownOptions.appendChild(dropdownOption);
            });
          }

          // Show modal
          modal.style.display = 'flex';
          overlay.classList.add('active');
        } catch (err) {
          console.error(err);
        }
      });
    });

    // Custom dropdown functionality
    const customDropdown = document.querySelector('.custom-dropdown');
    const dropdownOptions = document.getElementById('dropdown-options');
    const dropdownSelected = document.getElementById('dropdown-selected');
    const selectedText = document.querySelector('.selected-text');

    // Toggle dropdown on arrow click or selected area click
    dropdownSelected.addEventListener('click', (e) => {
      e.stopPropagation();
      customDropdown.classList.toggle('open');

      // Only align left if placeholder is showing
      if (selectedText.textContent === 'Choose your size') {
        selectedText.style.textAlign = 'left';
      } else {
        selectedText.style.textAlign = 'center';
      }
    });
    dropdownOptions.addEventListener('click', (e) => {
      selectedText.textContent = e.target.textContent;
      selectedText.style.textAlign = 'center'; // align selected option to center
      dropdownOptions.querySelectorAll('.dropdown-option').forEach((opt) => opt.classList.remove('selected'));
      e.target.classList.add('selected');

      customDropdown.classList.remove('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!customDropdown.contains(e.target)) {
        customDropdown.classList.remove('open');
      }
    });

    // Close dropdown on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        customDropdown.classList.remove('open');
      }
    });

    // Close modal function
    function closeModal() {
      modal.style.display = 'none';
      overlay.classList.remove('active');       // Reset color selection when modal closes
      const colorContainer = document.getElementById('color-options');
      if (colorContainer) {
        colorContainer.classList.remove('has-selection');
      }
      document.querySelectorAll('.color-option-container.selected').forEach((el) => el.classList.remove('selected'));
      // Reset size selection when modal closes
      const selectedText = document.querySelector('.selected-text');
      if (selectedText) {
        selectedText.textContent = 'Choose your size';
      }
      document.querySelectorAll('.dropdown-option').forEach((opt) => opt.classList.remove('selected'));
      const customDropdown = document.querySelector('.custom-dropdown');
      if (customDropdown) {
        customDropdown.classList.remove('open');
      }
    }
    
    // Close modal event listeners
    if (closeBtn) {
      closeBtn.onclick = closeModal;
    }
    overlay.onclick = closeModal;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  });