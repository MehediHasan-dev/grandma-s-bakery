
/**
 * Add eventlistener for multiple elements
 */

const addEventOnElement = function (elements, eventType, callback) {
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        element.addEventListener(eventType, callback);
    }
}


const toggleBtn = document.querySelectorAll('[data-nav-toggler]');
const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelectorAll("[data-overlay]");

/**
 * Mobile Nav Toggle
 */

const navToggle = function () {
    navbar.classList.toggle('active');

    toggleBtn.forEach(button => {
        button.classList.toggle('active');
    });
    overlay.forEach(overlay => {
        overlay.classList.toggle('active');
    });
}


addEventOnElement(toggleBtn, 'click', navToggle);
addEventOnElement(overlay, 'click', navToggle);



/**
 * HEADER 
 */

const header = document.querySelector('[data-header]');

window.addEventListener('scroll', e => {
    if (window.scrollY > 50) {
        header.classList.add('active');
    } else {
        header.classList.remove('active');
    }
})


const items = document.querySelectorAll('.category-item');

items.forEach(item => {
    item.addEventListener('click', () => {
        const itemImg = item.querySelector('.category-img');
        if (itemImg.classList.contains('active')) {
            return;
        }
        const activeImg = document.querySelector('.category-img.active');
        if (activeImg) {
            activeImg.classList.remove('active');
        }
        itemImg.classList.add('active');
    });
});




/**
 * Fetch data from items.json file
 */


let currentItemCount = 12;
let allItems = [];

const initApp = function () {
    const jsonFile = "./assets/js/items.json";

    fetch(jsonFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            allItems = data.items;

            appendItemsToDiv(allItems.slice(0, currentItemCount));

            filterItems("bread");

        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

document.addEventListener('DOMContentLoaded', initApp());

function appendItemsToDiv(items) {
    const itemList = document.querySelector('[data-item-list]');
    itemList.innerHTML = '';

    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'item-card';
        li.setAttribute('id', item.id);

        // Check if the item is recommended and conditionally show the badge
        const recommendedBadge = item.recommended ?
            `<span class="badge body-3" data-recommended="true">Recommended</span>` :
            `<span class="badge" data-recommended="false"></span>`;



        li.innerHTML = `
                    <figure class="img-holder" style="--width:300; --height:192;">
              <img src="${item.img}" width="300" height="192" loading="lazy" role="img" alt="${item.alt}"
                class="img-cover">

              <div class="card-overlay">

                <div class="preview-icon" data-preview-icon >

                  <i class="fa-regular fa-eye" aria-hidden="true"></i>

                </div>

              </div>

            </figure>


            <div class="card-content">

              <div class="flex-group">

                <p class="name body-2">
                  ${item.name}
                </p>

                <span class="price body-1">$${item.price}</span>

              </div>

              <div class="flex-group">

                <p class="category-name body-3">
                  ${item.categories}
                </p>


                <span>
                  ${recommendedBadge}
                </span>

              </div>

            </div>
        `

        itemList.appendChild(li);
        // console.log(li);

    })




    /**
     * Add event listener for all preview icons
     */

    // Select preview icons after appending items
    const previewIcons = document.querySelectorAll('.preview-icon');

    // Add event listener to each preview icon
    previewIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            previewIconClick(icon);
        });
    });


}


/**
 *
 * @param {Fileter items} category
 * @param {Show More Items} ShowMoreBtn
 */

function filterItems(category) {
    const filteredItems = allItems.filter(item => item.categories === category);


    currentItemCount = 12;


    appendItemsToDiv(filteredItems.slice(0, currentItemCount));

    const moreBtn = document.querySelector('[data-show-more-btn]');


    if (filteredItems.length > currentItemCount) {
        moreBtn.style.display = 'block';
        moreBtn.onclick = () => showMoreItems(filteredItems);
    } else {
        moreBtn.style.display = 'none';
    }
}

function showMoreItems(items) {
    let nextItemCount = currentItemCount + 12;

    if (nextItemCount < items.length) {
        appendItemsToDiv(items.slice(0, nextItemCount));
        currentItemCount = nextItemCount;
    } else {
        appendItemsToDiv(items.slice(0, items.length));
        currentItemCount = items.length;


        const moreBtn = document.querySelector('[data-show-more-btn]');
        moreBtn.style.display = 'none';
    }
}


const previewIconClick = function (icon) {

    const imgPreviewBox = document.querySelector('[data-imgPreview-box]');
    const previewBoxCrossIcon = document.querySelector('[data-previewBox-cross-icon]');
    const previewItemImg = document.getElementById('preview-img');
    const previewItemName = document.getElementById('preview-name');


    const itemCard = icon.closest('.item-card');
    const imgSrc = itemCard.querySelector('.img-cover').src;
    const name = itemCard.querySelector('.name').textContent;

    /**
     * Change img src and name for ease item
     */
    previewItemImg.src = imgSrc;
    previewItemName.textContent = name;

    imgPreviewBox.classList.add('active');

    /**
     * Img Preview Box remove
     */
    previewBoxCrossIcon.addEventListener('click', e => {
        imgPreviewBox.classList.remove('active');
    })
}



/**
 * Item Slider
 */

const sliderItems = document.querySelectorAll('[data-slider-item]');
const prevBtn = document.querySelector('[data-slider-prev-btn]');
const nextBtn = document.querySelector('[data-slider-next-btn]');


let currentSliderIndex = 0;

const changeSliderItem = function () {

    if (window.innerWidth >= 992) {
        for (let i = 0; i < sliderItems.length; i++) {
            sliderItems[i].style.display = 'none';
        }
        sliderItems[currentSliderIndex].style.display = 'flex';
    } else {
        // On smaller screens, all items should be visible
        for (let i = 0; i < sliderItems.length; i++) {
            sliderItems[i].style.display = 'flex';
        }
    }
}

changeSliderItem()

/**
 * NEXT SLIDER FUNCTION
 */

const sliderNext = function () {
    if (currentSliderIndex < sliderItems.length - 1) {
        currentSliderIndex++;
    } else {
        currentSliderIndex = 0;
    }

    changeSliderItem();
}


/**
 * PREVIOUS SLIDER FUNCTION
 */

const sliderPrev = function () {
    if (currentSliderIndex > 0) {
        currentSliderIndex--;
    } else {
        currentSliderIndex = sliderItems.length - 1;
    }
    changeSliderItem();
}

/**
 * Add EventListener for next and prev button
 */
prevBtn.addEventListener('click', sliderPrev);
nextBtn.addEventListener('click', sliderNext);

/**
 * Handle window resize event
 */

window.addEventListener('resize', changeSliderItem);