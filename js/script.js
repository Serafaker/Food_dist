'use strict';


window.addEventListener('DOMContentLoaded', () =>{

    const tabs= document.querySelectorAll('.tabheader__item'),
        tabsContent= document.querySelectorAll('.tabcontent'),
        tabsParent= document.querySelector('.tabheader__items');

    function hideTabContent (){
        tabsContent.forEach(item =>{
        item.classList.add("hide");
        item.classList.remove('show', 'fade');
    });
        tabs.forEach(item =>{
        item.classList.remove("tabheader__item_active");
    });
    }

    function showTabContent(i = 0){
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add("tabheader__item_active");
}

hideTabContent();
showTabContent();

    tabsParent.addEventListener("mouseover", (event)=>{

    const target= event.target;

    if (target && target.classList.contains('tabheader__item')){
        tabs.forEach((item, i) =>{
            if(target == item){
                hideTabContent();
                showTabContent(i);  
            }
        });
    }
});
//Таймер
    const deadLine = "2021-06-15",
          saleDate= document.querySelector('#sale_date');

    saleDate.innerHTML = deadLine;

    function getTimeRemaining (endtime){
        const t =Date.parse(endtime)- Date.parse( new Date()),
            days= Math.floor(t/(1000*60*60*24)),
            hours= Math.floor((t/(1000*60*60))%24),
            minutes= Math.floor((t/(1000*60)) % 60),
            seconds= Math.floor((t/1000)% 60);

    return {
        "total" : t,
        days,
        hours,
        minutes,
        seconds
    };
}
 // функция добавлять ноль если число меньше 10
    function getZero (num) {
        if(num >=0 && num <10){
            return `0${num}`;
        } else {
            return num;
        }

}
    function setClock (selector, endtime) {
        const timer= document.querySelector(selector),
            days= timer.querySelector("#days"),
            hours= timer.querySelector("#hours"),
            minutes= timer.querySelector("#minutes"),
            seconds= timer.querySelector("#seconds"),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();
    function updateClock() {
        const t = getTimeRemaining(endtime);
            days.innerHTML = getZero(t.days);
            hours.innerHTML= getZero(t.hours);
            minutes.innerHTML= getZero(t.minutes);
            seconds.innerHTML= getZero(t.seconds);

        if (t.total <=0){
            clearInterval(timeInterval);
        }

    }

    }
    setClock('.timer', deadLine);


    ///Модально окно

    const modalTrigger= document.querySelectorAll('[data-modal]'),
          modal= document.querySelector(".modal");

    function openModal(){
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow= 'hidden';
        clearInterval(modalTimerId);
}


    modalTrigger.forEach(btn=>{
        btn.addEventListener('click', openModal);
});

    function closeModal(){
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow= '';
    }
    

    modal.addEventListener('click', (e)=>{
        if (e.target=== modal || e.target.getAttribute("data-close") == ""){
        closeModal();
        }
    });

    document.addEventListener('keyup', (e)=>{
        if (e.code=== "Escape" && modal.classList.contains('show')){
            closeModal();
       }
    });
    const modalTimerId= setTimeout(openModal, 50000);

    function modalShowByScroll (){
        if(window.pageYOffset+ document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            openModal();
            window.removeEventListener('scroll', modalShowByScroll);
        }
        
    }


    window.addEventListener('scroll', modalShowByScroll);



////Карточки  с использование классов

    class MenuCard {
        constructor(src,alt, title, discr, price, parentSelector, ...classes){
        this.src= src;
        this.alt= alt;
        this.title= title;
        this.discr= discr;
        this.price= price;
        this.classes= classes ;
        this.parent= document.querySelector(parentSelector);
        this.transfer= 27;
        this.changeToUAH();
        }

        changeToUAH(){
            this.price= this.price* this.transfer;
        }

        render(){
            const element= document.createElement('div');
            if(this.classes.length===0){
                this.element= 'menu__item';
                element.classList.add(this.element); 
            }else{
                this.classes.forEach(className => element.classList.add(className));
            }
            element.innerHTML=`
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.discr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
                `;
            this.parent.append(element);
        }
        
    }

    // const div = new MenuCard();
    // div.render();
    const getResource= async (url) =>{
        const res= await fetch(url);

        if (!res.ok){
            throw new Error(`Could not fetch ${url}, status:${res.status}`);
        }
        return await res.json();
    };
    
    getResource("http://localhost:3000/menu")
        .then(data =>{
            data.forEach(({img, altimg, title, descr, price})=>{
                new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
            });
        });


    // Формы отправки




    const forms=document.querySelectorAll('form');

    const message={
        loading: "img/form/spinner.svg",
        success: 'Спасибо! Скоро вам ответим!',
        failure:"Что-то пошло не так"
    };

    forms.forEach((item)=>{
        bindPostData(item);
    });

    const postData= async (url, data) =>{
        const res= await fetch(url,{
            method: "POST",
            headers: {
                "Content-type":'application/json'
            },
            body: data
        });
        return await res.json();
    };
    
    
    function bindPostData(form){
        form.addEventListener('submit', (e) =>{
            e.preventDefault();    // в AJAX запросах для обнуления стандартного поведения брайзера (перезагрузка)
            
            const statusMessage= document.createElement("img");
            statusMessage.src = message.loading;
            statusMessage.style.cssText =`
                display: block;
                margin: 0 auto;
            `;
            
            form.insertAdjacentElement("afterend", statusMessage);

            

            // request.setRequestHeader("Content-type", 'multipart/form-data'); если используется xmlhttpRequest c  formData то именовать запрос не надо!!!!!!
          
            const formData= new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));
            ///выше преобразование formData в json, ранеее было переборос формы через forEach
      

        postData("http://localhost:3000/requests", json)
        .then(data =>{
            console.log(data);
            showThanksModal(message.success);
            
            statusMessage.remove();
        }).catch(()=>{
            showThanksModal(message.failure);
        }).finally(()=>{
            form.reset();
        });

        });
    }
    

    function showThanksModal (message){
        const prevModalDialog = document.querySelector(".modal__dialog");
        prevModalDialog.classList.add('hide');

        const thanksModal = document.createElement("div");
        thanksModal.classList.add("modal__dialog");
        openModal();
        thanksModal.innerHTML= `
            <div class="modal__content">
                <div data-close class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector(".modal").append(thanksModal);
        setTimeout(()=>{
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

});
