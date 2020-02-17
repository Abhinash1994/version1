module.exports = {

    roles: function(){
        return [
            {
                'id' : 0,
                'position' : 'Receptionist',
            },
            {
                'id' : 1,
                'position' : 'Owner',
            },
            {
                'id' : 2,
                'position' : 'Manager',
            },
            {
                'id' : 3,
                'position' : 'Receptionist',
            },
            {
                'id' : 4,
                'position' : 'Stylist',
            },
            {
                'id' : 5,
                'position' : 'Helper',
            },
            {
                'id' : 6,
                'position' : 'Unknow',
            },
            {
                'id' : 7,
                'position' : 'Owner',
            },
            {
                'id' : 8,
                'position' : 'Salon Head',
            },
            {
                'id' : 9,
                'position' : 'Assistant Manager',
            }
        ];
    },

    getserviceReminders(){
      let data = []
      data.push({
          title : "Waxing",
          type : 1,
          recommendedDays : 15,
          serviceCodes : [202],
          reminders : [{
            day : 15,
          },
          {
            day : 30,
          }]
      })
      data.push({
          title : "Menicure",
          type : 2,
          recommendedDays : 45,
          serviceCodes : [205],
          reminders : [{
            day : 30,
          },
          {
            day : 45,
          }]
      })
      return data;
    },
    
    getSubscriptionModelChangeDate(){
        return new Date(2019, 0, 1);
    },

    getEarlyBirdOfferGlodSubscriptionPrice: function(type){
        if(type == 1)return 699;
        if(type == 2)return 1199;
        else return 1699;
    },

    getSubscriptionPriceLessCoupon: function(){
        return "APPTSUBSCRIPTION"
    },

    getEarlyBirdOfferGlodSubscriptionPriceTypeOne: function(){
        return 699;
    },

    getEarlyBirdOfferGlodSubscriptionPriceTypeThree: function(){
        return 199;
    },


    getEarlyBirdOfferGlodSubscriptionPriceTypeTwo: function(){
        return 1199;
    },

    getRealGlodSubscriptionPrice: function(){
        return 1699;
    },

    getEarlyBirdOfferMinimumServiceAmount: function(parlorType){
        if(parlorType == 4)return 300;
        return 1000;
    },

    getAppRevenueDiscountCouponCode: function(){
        return "HAPPYHOUR";
    },

    getPackagesObj : function(){
        return {
            name : "Packages",
            categoryId : 1,
            image : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1513603175/PACKAGE_ICON_af7hfl.png",
        }
    },

    getFlashSaleObj : function(){
        return {
            name : "Flash Sale",
            categoryId : ConstantService.getFlashCouponCategoryId(),
            image : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1540978610/flash_for_service_name_3x_sitxrm.png",
        }
    },

    getFlashCouponCategoryId: function(){
        return 1000;
    },

    getInfoDetails : function(parlorType){
        var data = [];
        if(parlorType == 1){
            data.push('Take a safe road and try the usual with our affordable Be U Blue Salons.');
            data.push('Trained Professionals');
            data.push('Accessibility to Premium and decent brands');
            data.push('Hygienic and well-sanitized products');
            data.push('Amicable Ambience');
        }else if(parlorType == 2){
            data.push('Don'+"'"+'t want to spend a bomb on beauty? Go easy on your pocket and opt for our Be U Green salons.');
            data.push('Trained Professionals');
            data.push('Access to decent brands');
            data.push('Hygienic products and ambience');
        }else{
            data.push('Go Premium and flaunt your lavish style because regular is too boring!')
            data.push('Expert Professionals')
            data.push('Accessibility to Premium Brands')
            data.push('Hygienic and well-sanitized products')
            data.push('Lavish and Luxurious ambience')
        }
        return data;
    },

    

    getCorporateDeals : function(parlorType){
        var data = [];
        data.push({
          start : '1 Month Free',
          end : 'subscription trial',
            // title : '200% Cash back On Your First App Payment.',
          image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1502271597/CORPORATE-ICONS-_2_ehaaqt.png',
        });
        data.push({
          start : '& enjoy free',
          end : ' services worth Rs 500',
          image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1502271588/CORPORATE-ICONS-_3_rmn8rh.png',
        });
        return data;
    },

    getCorporateReferalsFemale : function(parlorType){
      var data ={data :[] , image :''}
        // var data = {data :[] , image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1502271588/CORPORATE-ICONS-_3_rmn8rh.png', description: 'Corporate Referral Benefits'};
        // data.data.push({
        //     start   : '5 Referrals:',
        //     // middle  : 'Upgrade 1 Haircut -->',
        //     end     : 'Deluxe Express Wax',
        //     // title : '5 Referrals: Upgrade 1 Haircut To Deluxe Express Wax (for female) or Classic Facial(for male)',
        //     // image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1502271588/CORPORATE-ICONS-_3_rmn8rh.png',
        // });
        // data.data.push({
        //     start   : '15 Referrals:',
        //     // middle  : 'Upgrade 1 Haircut -->',
        //     end     : 'Global Hair Color',
        //     // title : '15 Referrals: Upgrade 1 Haircut To Global Haircolor (for female) or Premium Facial(for male)',
        //     // image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1502271588/CORPORATE-ICONS-_3_rmn8rh.png',
        // });
        // data.data.push({
        //     start   : '25 Referrals:',
        //     // middle  : 'Upgrade 1 Haircut -->',
        //     end     : 'Keratin Hair Treatment',
        //     // title : '25 Referrals: Upgrade 1 Haircut To Keratin Treatment (for female) or Luxury Facial(for male)',
        //     // image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1502271588/CORPORATE-ICONS-_3_rmn8rh.png',
        // });
        return data;
    },

    getCorporateReferalsMale : function(parlorType){
      var data ={data :[] , image :''}
        // var data = {data : [] ,image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1502271588/CORPORATE-ICONS-_3_rmn8rh.png'};
        // data.data.push({
        //     start   : '5 Referrals:',
        //     // middle  : 'Upgrade 1 Haircut -->',
        //     end     : 'Classic Facial',
        //     // title : '5 Referrals: Upgrade 1 Haircut To Deluxe Express Wax (for female) or Classic Facial(for male)',
        //     // image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1502271588/CORPORATE-ICONS-_3_rmn8rh.png',
        // });
        // data.data.push({
        //     start   : '15 Referrals:',
        //     // middle  : 'Upgrade 1 Haircut -->',
        //     end     : 'Hair Spa',
        //     // title : '15 Referrals: Upgrade 1 Haircut To Global Haircolor (for female) or Premium Facial(for male)',
        //     // image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1502271588/CORPORATE-ICONS-_3_rmn8rh.png',
        // });
        // data.data.push({
        //     start   : '25 Referrals:',
        //     // middle  : 'Upgrade 1 Haircut -->',
        //     end     : 'Expert Hair Treatment',
        //     // title : '25 Referrals: Upgrade 1 Haircut To Keratin Treatment (for female) or Luxury Facial(for male)',
        //     // image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1502271588/CORPORATE-ICONS-_3_rmn8rh.png',
        // });
        return data;
    },

    getCorporateTnC : function(parlorType){
      return{
        title : 'T&C',
        points : [
          // "*1 Referral = 1 Successful Corporate Email ID Reference",
          // "*Each Free Haircut To Be Availed In Each Respective Month",
          // "*Upgraded Services To Be Availed In Each Respective Month",
          // "*Referral To Be Earned Once Your Friend Registers Under The",
          // "Corporate Program And Visits Us For Their 1st Free Haircut ",
          // "*You Can Use Your Referrals For Any Of The 3 Haircut Upgrades"
          // "Upto Rs 300 Discount On Using Coupon Codes"
        ]
      };
    },

    getCorporateRegister : function(parlorType){
        var data = [];
        data.push({
            title : 'Introduce us to your HR and get 5000 Freebies Points upon successfull registration of your company.',
            image : '',
        });
        return data;
    },

    getThreadingServiceDetail: function(quantity){
        return {
                  serviceId : "597742cd06adcb59788cbc79",
                  serviceCode : 430,
                  type : "membership",
                  name : "Threading",
                  quantityRemaining : quantity,
              };
    },

    getFreeHairWaxServiceDetail: function(gender){
      return {
                  serviceId : gender=="F" ? "59520f3b64cd9509caa273ec" : "58707eda0901cc46c44af2eb",
                  serviceCode : gender == "F" ? 502 : 52,
                  brandId : gender == "F" ? "594b99fcb2c790205b8b7d93" : "",
                  price : gender == "F" ? 600 : 300,
                  type : "membership",
                  name : gender=="F" ? "Classic Express Wax" : "Male Hair Cut",
                  quantityRemaining : 1,
              };
    },

    welcomeOffer :function(){
      return {
        welcomeOffer : ''
      }
      /*return{
        welcomeOffer :'<div style="text-align:center;width:100%;font-size: 8px;color:#ffffff"><span>Welcome Offer:</span><span style="color:#d2232a">1 Free Haircut</span><span style="color:#ffffff"> (Men) Or</span><span style="color:#d2232a"> 1 Free Classic Express Wax</span><span style="color:#ffffff"> (Women) For Each Member, On</span><span style="color:#d2232a"> 1st Time Registration</span><span style="color:#ffffff"> In Family Wallet</span></div>'
      }*/
    },



    getMembershipDetails : function(detailReq){
        var t1=[2,0,3,2,3,5,6], t2=[1,0,2,1,2,2,4], t3=[1,0,1,0,1,2,3];
        var today = new Date(), refDate = new Date(2018, 1, 1), refDate2 = new Date(2017, 10, 13);
        var daysDiff = HelperService.getNoOfDaysDiff(today, refDate);
        var daysDiff2 = HelperService.getNoOfDaysDiff(today, refDate2);
        var data = [
          {
              title : '<span style="color : #034694;">1100 WALLET CREDITS @ ₹ 1000</span>',
              cardImage : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1510657624/membership_cards_3_pdnz2q.png',
              membershipId : '5a0c0ab57b29161e8469e3d7',
              dealPercentage : 7,
              credits : 1100,
              line1 : "\u2022<b style='color : #58595B;'>10% Extra Credits </b>",
              line2 : "\u2022<b style='color : #58595B;'>3 Free Threadings </b>",
              line3 : "<span style='color : #58595B;'>(Eyebrows + Upper-Lips)</span>",
              menuDiscountString : "10% Extra Credits",
              dealDiscountString : "3 Free Threadings",
              normalPercentage : 25,
              details : ConstantService.getMembershipDetail(0, 0, 5000),
              price: 1000,
              noOfFreeHairCut : 1,
              freeThreading : 3,
              noOfMembersAllowed : 1,
              validity: 3,
              countDown1 : '<b style="font-weight:bold;font-size:9px;color : #58595B;">'+HelperService.getTotalMembershipSold(daysDiff, t1)+'</b><span style = "font-size: 9px;color : #58595B;"> Out Of </span><b style="font-weight:bold;font-size:9px;color : #58595B;">100</b> <span style = "font-size: 9px;color : #58595B;">Sold In February</span>',
              countDown2 : '<b style="font-weight:bold;font-size:9px;color : #76787A;">'+HelperService.getTotalMembershipSold(daysDiff2, t1)+'</b><span style = "font-size: 9px;color : #76787A;"> Sold Till Date!​</span>'
          },
          {
              title : '<span style="color : #034694;">4500 WALLET CREDITS @ ₹ 4000</span>',
              cardImage : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1510657220/membership_cards_2_ldsvyg.png',
              membershipId : '5a0c0aed7b29161e8469e74d',
              dealPercentage : 7,
              credits : 4500,
              line1 : "\u2022<b style='color : #58595B;'>13% Extra Credits </b>",
              line2 : "\u2022<b style='color : #58595B;'>12 Free Threadings </b>",
              line3 : "<span style='color : #58595B;'>(Eyebrows + Upper-Lips)</span>",
              menuDiscountString : "13% Extra Credits",
              dealDiscountString : "12 Free Threadings",
              normalPercentage : 25,
              details : ConstantService.getMembershipDetail(0, 0, 4000),
              price:4000,
              noOfFreeHairCut : 3,
              freeThreading : 12,
              noOfMembersAllowed : 3,
              validity: 6,
             countDown1 : '<b style="font-weight:bold;font-size:9px;color : #58595B;">'+HelperService.getTotalMembershipSold(daysDiff, t2)+'</b><span style = "font-size: 9px;color : #58595B;"> Out Of </span><b style="font-weight:bold;font-size:9px;color : #58595B;">50</b> <span style = "font-size: 9px;color : #58595B;">Sold In February</span>',
              countDown2 : '<b style="font-weight:bold;font-size:9px;color : #76787A;">'+HelperService.getTotalMembershipSold(daysDiff2, t2)+'</b><span style = "font-size: 9px;color : #76787A;"> Sold Till Date!​</span>'
            },
          {
              title : '<span style="color : #034694;">9600 WALLET CREDITS @ ₹ 8000</span>',
              cardImage : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1510656120/membership_cards_1_srsd54.png',
              membershipId : '5a0c0b397b29161e8469ead8',
              dealPercentage : 7,
              credits : 9600,
              line1 : "\u2022<b style='color : #58595B;'>20% Extra Credits </b>",
              line2 : "\u2022<b style='color : #58595B;'>25 Free Threadings </b>",
              line3 : "<span style='color : #58595B;'>(Eyebrows + Upper-Lips)</span>",
              menuDiscountString : "20% Extra Credits",
              dealDiscountString : "25 Free Threadings",
              normalPercentage : 25,
              details : ConstantService.getMembershipDetail(0, 0, 20000),
              price:8000,
              noOfFreeHairCut : 5,
              freeThreading : 25,
              noOfMembersAllowed : 5,
              validity: 12,
              countDown1 : '<b style="font-weight:bold;font-size:9px;color : #58595B;">'+HelperService.getTotalMembershipSold(daysDiff, t3)+'</b><span style = "font-size: 9px;color : #58595B;"> Out Of </span><b style="font-weight:bold;font-size:9px;color : #58595B;">25</b> <span style = "font-size: 9px;color : #58595B;">Sold In February</span>',
              countDown2 : '<b style="font-weight:bold;font-size:9px;color : #76787A;">'+HelperService.getTotalMembershipSold(daysDiff2, t3)+'</b><span style = "font-size: 9px;color : #76787A;"> Sold Till Date!​</span>'
            },
        ];
        return [];
    },

    getFamilyWalletString: function(){
        return "Family Wallet";
    },

    getMembershipDetail: function(dealPer, normalPer, title){
        var obj = [];
        obj.push(ConstantService.getDealDetailObj(dealPer, true, title));
        obj.push(ConstantService.getDealDetailObj(normalPer, false, title));
        return obj;
    },

    getDealDetailObj: function(per, isDeal, title){
        var discount = parseInt(((isDeal ? 300 : 1100 ) * per)/100);
        var priceAfterDiscount = isDeal ? 300 - discount : 1100 - discount;
        var closingBalance = title - priceAfterDiscount;
        return {
            head : 'Membership Card ' + title,
            values : [
                {
                  title : 'Upfront Payment',
                  value : '₹ '+title + ' + Taxes',
                },
                {
                  title : 'Discount : On ' + (isDeal ? 'Deal' : 'Normal') + ' Menu',
                  value : per + '%',
                },
                {
                  title : '',
                  value : '',
                },
                {
                  title : 'Opening Balance',
                  value : '₹ '+title,
                },
                {
                  title : isDeal ? 'Blow Dryer' : 'Root touch up - INOA',
                  value : '₹ '+ (isDeal ? '300' : '1100'),
                },
                {
                  title : 'Less Discount @ ' + per + '% (' + (isDeal ? 'Deal' : 'Normal') + ' Menu)',
                  value : '₹ '+  discount,
                },
                {
                  title : 'Price After Discount',
                  value : '₹ '+ priceAfterDiscount,
                },
                {
                  title : 'Closing Balance('+title+'-'+priceAfterDiscount +')',
                  value : '₹ '+ closingBalance,
                },
            ],
        };
    },


   periods: function(){
        return [
            {
                'range':'1st Jan to 15th Jan',
                'period': 1
            },
            {
                'range':'16th Jan to 31st Jan',
                'period': 2
            },
            {
                'range':'1st Feb to 15th Feb',
                'period': 3
            },
            {
                'range':'16th Feb to 28th Feb',
                'period': 4
            },
            {
                'range':'1st Mar to 15th Mar',
                'period': 5
            },
            {
                'range':'16th Mar to 31th Mar',
                'period': 6
            }
        ];
    },

    getDeals : function(){
        var deals = [];
        deals.push({
          image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1489057199/website%20home%20page%20icons/Deal_icons_homepage_4.png',
          category : 'Haircut',
          dealType : 'dealPrice',
          price : 300,
          brandId : "",
          productId : "",
          discount : 54,
          dealId : 36,
          serviceCodes : [202],
        });
        deals.push({
          image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1489057200/website%20home%20page%20icons/Deal_icons_homepage_5.png',
          category : 'Spa/ Hairspa',
          dealType : 'dealPrice',
          price : 750,
          brandId : "5935646e00868d2da81bb91c",
          productId : "",
          discount : 37,
          dealId : 47,
          serviceCodes : [50],
        });
        deals.push({
          image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1489057199/website%20home%20page%20icons/Deal_icons_homepage_6.png',
          category : 'Makeup',
          dealType : 'dealPrice',
          price : 1999,
          brandId : "",
          productId : "",
          discount : 43,
          dealId : 24,
          serviceCodes : [10],
        });
        deals.push({
          image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1489057199/website%20home%20page%20icons/Deal_icons_homepage_7.png',
          category : 'Blowdry',
          dealType : 'dealPrice',
          price : 300,
          brandId : "",
          productId : "",
          discount : 40,
          dealId : 38,
          serviceCodes : [198],
        });
        deals.push({
          image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1489057199/website%20home%20page%20icons/Deal_icons_homepage_11.png',
          category : 'Keratin',
          dealType : 'dealPrice',
          price : 3500,
          brandId : "",
          productId : "",
          discount : 51,
          dealId : 2,
          serviceCodes : [92],
        });
        deals.push({
          image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1489057199/website%20home%20page%20icons/Deal_icons_homepage_11.png',
          category : 'Straightening/ Rebonding',
          dealType : 'dealPrice',
          price : 4000,
          brandId : "5935646e00868d2da81bb91c",
          productId : "",
          discount : 53,
          dealId : 1,
          serviceCodes : [89],
        });
        deals.push({
          image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1489057199/website%20home%20page%20icons/Deal_icons_homepage_12.png',
          category : 'Global Color',
          dealType : 'dealPrice',
          price : 2000,
          brandId : "5935646e00868d2da81bb91c",
          productId : "593564a100868d2da81bb91d",
          discount : 60,
          dealId : 3,
          serviceCodes : [96],
        });
        return deals;
    },

    getFreeBiesTnC : function(){
      return{
        title : 'Terms & Conditions*',
        points : [
          "Earn Max. 2,000 Freebie Points Via Refer And Earn",
          "Earn Max. 500 Freebie Points Via 15% Cashback",
          "Redeem 25% Freebie Points On Digital Payments & 12.5% On Cash Payments Through The App, Above Bill Value Of ₹ 2,000",
          "Redeem 10% Freebie Points On Digital Payments & 5% On Cash Payments Through The App, Till Bill Value Of ₹ 2,000",
          "Redeem Freebie Points Max. Twice a Day And Thrice a Month",
          "Freebie Points To Expire By The End Of 1 Year",
          "Free Classic Wax-Her/Free Haircut-Him and 1000 Freebie Points Earned On Download To Expire By End Of 30 Days From Download",
          "1 Referral = 1 Successful Corporate ID Reference",
          "Each Free Haircut To Be Availed In Each Respective Month",
          "Upgraded Services To Be Availed In Each Respective Month",
          "Referral To Be Earned Once Your Friend Registers Under The Corporate Program And Visits Us For Their 1st Free Haircut",
          "You Can Use Your Referrals For Any Of The 3 Haircut Upgrades",
          "Free Classic Express Wax Is Applicable Only For App Downloads From And After 1st September 2017"
        ]
      };
    },


    getFreeBies : function(referalCode , gender){
        console.log(referalCode);
        var data = [];
           data.push({
                title : 'Download The App And Get Free Classic Express Wax-Her/Free Haircut-Him & 1000 Freebie Points*',
                message : 'Download The Be U Salons App And Get Free Classic Express Wax-Her/Free Haircut-Him, On a Min. Bill Value Of Rs 500, & 1000 Freebie Points. Valid For 30 Days From Download.',
                image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1490003616/search_icons_1_3_yszyua.png',
                action : 'book',
                head : ' Free '+ (gender =="F" ? 'Classic Express Wax' : 'Haircut') +'',
                newHead: ''+ (gender =="F" ? 'Classic Express Wax' : 'Haircut') +'',
                newPoints : '1000 Freebies',
                points : '300',
                description : 'On Download',
            });
           data.push({
                title : 'Corporate ID Benefits*',
                message : 'Add Your Corporate ID And Get 200% Cashback On Your Next App Payment And 3 Coupon Codes. Each Free Haircut To Be Availed In Each Respective Month.',
                image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1490003616/search_icons_1_3_yszyua.png',
                action : 'book',
                head : ' Corporate ID Benefits',
                newHead: '200% Cashback',
                newPoints : '3 Coupons',
                points : 'On Adding Corporate ID',
                description : 'On Adding Corporate ID',
            });

            // data.push({
            //     title : 'Corporate Referral Benefits*',
            //     message : 'Use Referral Code "'+referalCode+'" And Introduce Us To Your Male And Female Friends Working At Our Registered Corporates To Upgrade Your Haircuts To Exciting Services, Once They Visit Us For Their First Free Haircut. \n\n Corporate Referral Benefits For Female* \n 5 Referrals: Upgrade 1 Haircut To Deluxe Express Wax. 15 Referrals: Upgrade 1 Haircut To Global Hair Color. 25 Referrals: Upgrade 1 Haircut To Keratin Treatment. \n\n Corporate Referral Benefits For Male* \n 5 Referrals: Upgrade 1 Haircut To Classic Facial. 15 Referrals: Upgrade 1 Haircut To Hair Spa. 25 Referrals: Upgrade 1 Haircut To Expert Treatment',
            //     image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1490003616/search_icons_1_3_yszyua.png',
            //     action : 'corporateRefer',
            //     head : ' Upgrade',
            //     newHead: 'Upgrade',
            //     newPoints : '3 Free Haircuts',
            //     points : 'On Corporate Referrals',
            //     description : 'On Corporate Referrals',
            // });


            //  data.push({
            //     title : 'Corporate Referral Benefits*',
            //     message : 'Use Referral Code "'+referalCode+'" And Introduce Us To Your Male And Female Friends Working At Our Registered Corporates To Upgrade Your Haircuts To Exciting Services, Once They Visit Us For Their First Free Haircut.',
            //     image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1490003616/search_icons_1_3_yszyua.png',
            //     action : 'corporateRefer',
            //     head : ' Upgrade',
            //     newHead: 'Upgrade',
            //     newPoints : '3 Free Haircuts',
            //     points : 'On Corporate Referrals',
            //     description : 'On Corporate Referrals',
            // });
            //  data.push({
            //     title : 'Corporate Referral Benefits For Female*',
            //     message : '5 Referrals: Upgrade 1 Haircut To Deluxe Express Wax \n 15 Referrals: Upgrade 1 Haircut To Global Hair Color \n 25 Referrals: Upgrade 1 Haircut To Keratin Treatment',
            //     image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1490003616/search_icons_1_3_yszyua.png',
            //     action : 'corporateRefer',
            //     head : ' Get ',
            //     newHead: 'Get',
            //     newPoints : 'Referral Benefits',
            //     points : 'For Female',
            //     description : 'For Female',
            // });
            //   data.push({
            //     title : 'Corporate Referral Benefits For Male*',
            //     message : '5 Referrals: Upgrade 1 Haircut To Classic Facial \n 15 Referrals: Upgrade 1 Haircut To Hair Spa \n 25 Referrals: Upgrade 1 Haircut To Expert Treatment',
            //     image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1490003616/search_icons_1_3_yszyua.png',
            //     action : 'corporateRefer',
            //     head : ' Get ',
            //     newHead: 'Get',
            //     newPoints : 'Referral Benefits',
            //     points : 'For Male',
            //     description : 'For Male',
            // });
            data.push({
                title : 'Refer & Earn*', // 50 100
                message : 'Use Referral Code "'+referalCode+'" To Earn 100 Points Once Your Friend Signs Up. You Earn An Additional 200 Points Post Your Friend' + "'s" +' First Appointment. Make Sure Your Friend Avails The Service.',
                image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1490003616/search_icons_1_3_yszyua.png',
                action : 'refer',
                head : 'Refer & Earn',
                newHead: 'Refer & Earn',
                newPoints : '15% Discount',
                points : '100+200',
                description : 'Coupons',
            });
             data.push({
                title : 'Review And Get 25 Freebie Points*', // 50 100
                message : 'Go To Completed Appointments In Profile Section And Share Your Experience Of The Services Availed, To Earn 25 Freebie Points.',
                image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1490003616/search_icons_1_3_yszyua.png',
                action : 'book',
                head : 'Get',
                newHead: 'Get',
                newPoints : '25 Freebie Points',
                points : '25',
                description : 'On Completed Appoitments',
            });
            data.push({
                title : 'Get 15% Cashback On 1st Digital Payment*',
                message : "Book Any Service And Get 15% Cashback On Your Digital Payments Through The App, Once Your Appointment Is Completed.",
                image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1490003616/search_icons_1_5_bsoqgh.png',
                action : 'book',
                head : 'Get Cashback',
                newHead: 'Get',
                newPoints : '100% Cashback',
                points : '100%',
                description : 'On 1st Digital Payment',
            });
            data.push({
                title : 'Get 10% Cashback On 2nd Digital Payment Onwards*',
                message : "On Your 2nd Payment Onwards, Get 10% Cashback On Digital Payments And 5% Cashback On Your Cash Payments Through The App, Once Your Appointment Is Completed.",
                image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1490003616/search_icons_1_5_bsoqgh.png',
                action : 'book',
                head : 'Get Cashback',
                newHead: 'Get',
                newPoints : '10% Cashback',
                points : '10%',
                description : '2nd Digital Payment Onwards',
            });
            // data.push({
            //     title : 'Free Threading On Digital Payment*',
            //     message : 'Avail a Complimentary Threading (Upper Lips + Eyebrows) On Booking a Min. Order Of Rs. 200.',
            //     image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/c_scale,h_128,w_128/v1493463998/thread_rgckbx.png',
            //     action : 'book',
            //     head : 'Free Threading',
            //     newHead: 'Threading',
            //     newPoints : 'Free',
            //     points : '100',
            //     description : 'On Digital Payment',
            // });
             data.push({
                title : 'Free Classic Express Wax-Her/Free Haircut-Him*',
                message : 'Share Free Classic Express Wax-Her/Free Haircut-Him With Your Friends & An Additional 1000 Freebie Points. Spread The Word.',
                image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1490003616/search_icons_1_3_yszyua.png',
                action : 'share',
                head : ' Free '+ (gender =="F" ? 'Classic Express Wax' : 'Haircut') +'',
                newHead: ''+ (gender =="F" ? 'Classic Express Wax' : 'Haircut') +'',
                newPoints : 'Free',
                points : '300',
                description : 'Share With Friends',
            });

        return data;
    },

     getFreeBiesNewObject : function(referalCode , gender , subscription , allow100PercentDiscount){
        console.log(referalCode);
        var data = [];

        if(subscription == false){
         data.push({
                title     : 'Earn More Coupons',
                message   : 'Want To Get Your Hands On More Coupons? Get More Coupons For Yourself And Save On Your Bill Every Time!',
                image     : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1519881005/coupons-freebie_yellow_repeats_3_rtpms8.png',
                insideArray : [
                {
                  insideTitle : 'Refer and Earn',
                  insideImage : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1506511295/refer_earn-_your_corporate_referal_code_hs0wwm.png',
                  arrayInfo   : [{
                        infoTitle   : "Share Your Referral Code",
                        infoMessage : ["Refer our app to your friends using code "+referalCode+" to get 25% discount coupon(max ₹ 1000) on your total bill, once your friend has downloaded the app using your referral code."],
                        buttonMessage :["Get Free Classic Express Wax-Her/Free Haircut-Him (On Min. Bill Value Of ₹ 500) + ₹ 500 B-Cash On Downloading The Be U Salons App And Get 15% Cashback On Digital Payments Via Be U Salons App. To Avail The Same, Use Code "+referalCode+" To Sign Up : http://onelink.to/bf45qf"],
                        infoIcon    :  "http://res.cloudinary.com/dyqcevdpm/image/upload/v1506515474/giftbox_1_1_uqnlgc.png",
                        tnc         : ["T&C:","Upto Rs 1000 Discount On Using Coupon Codes"],
                        buttons     : [{
                                buttonTitle   : 'REFER NOW',
                                buttonAction  : 'refer',
                                buttonColor   : 'red',
                        }],

                  }]
                },
                 
                {
                  insideTitle : 'Complete Profile',
                  insideImage : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1520946701/profile-_earn_more_coupon_tile_bp7jjr.png',
                  arrayInfo   : [{
                        infoTitle   : "Complete your Profile",
                        infoMessage : ["Get 10 % Discount Coupon on Completion Of Your Profile Section"],
                        buttonMessage:[" "],
                        infoIcon    :  "http://res.cloudinary.com/dyqcevdpm/image/upload/v1506515474/giftbox_1_1_uqnlgc.png",
                        tnc         : ["T&C:","Maximum Rs 200 Discount On Using Coupon Code"],
                         buttons     : [{
                                buttonTitle   : 'COMPLETE NOW',
                                buttonAction  : 'preference',
                                buttonColor   : 'red',
                        }],

                  }]
                },
                
                {
                  insideTitle : 'Add Corporate ID',
                  insideImage : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1521100586/freebie_corporate_id_for_earn_more_coupons_s8puxv.png",
                  arrayInfo   : [{
                        infoTitle   : "Enjoy 3 Coupons",
                        infoMessage : ["Add Your Corporate Email Id And Get 3 Coupons Worth 15% Discount Applicable At Checkout On Total Bill Value. Coupons will Be Visible In Your Coupon Code Sections"],
                        buttonMessage:[" "],
                        infoIcon    :  "http://res.cloudinary.com/dyqcevdpm/image/upload/v1506515474/giftbox_1_1_uqnlgc.png",
                        tnc         : ["T&C:","Upto Rs 300 Discount On Using Coupon Codes"],
                        buttons     : [{
                                buttonTitle   : 'ADD NOW',
                                buttonAction  : 'corporate',
                                buttonColor   : 'red',
                        }],

                  }]
                },
                
                 
                ]
            })
       }
         if(allow100PercentDiscount == true){
          data.push({
                title     : 'Use Your B-Cash',
                message   : 'Go Cashless This Time! Save Your Wallet Money & Redeem B-Cash On Your Total Bill Value.',
                 image     : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1507898086/redeem_ur_points_freebie_yellow_repeats_5_x1iqyk.png',
                insideArray : [{
                  insideTitle : "On Any Bill Value",
                  insideImage : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1506511267/Redeem_your_points-_billing_above_2k_gg9yko.png",
                  arrayInfo   : [{
                        infoTitle   : "Redeem B-Cash On Digital Payments",
                        infoMessage : ["Redeem your B-Cash balance (max ₹500 on app digital payments only) on your next visit (within 30 days of earning)."],
                        buttonMessage:[" "],
                        infoIcon    :  "http://res.cloudinary.com/dyqcevdpm/image/upload/v1506515474/giftbox_1_1_uqnlgc.png",
                        tnc         : ["T&C:","Redeem B-Cash Max. Once a Day.","B-Cash To Expire By The End Of 30 Days(from Earning)."],
                         buttons     : [{
                                buttonTitle   : 'BOOK NOW',
                                buttonAction  : 'book',
                                buttonColor   : 'red',
                        }],

                  }]
                }]
            });


          data.push({
                title     : 'Earn B-Cash ',
                message   : 'Earn B-Cash By Digital Payments, Facebook Check-In, Sharing Your Reviews, etc And Redeem Them To Save Upto 25% On Your App Payments.',
                image     : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1507898038/refer_n_earn_freebie_yellow_repeats_2_nqzcco.png',
                insideArray : [
                {
                  insideTitle : "Every Appointment",
                  insideImage : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1505218535/freebie_inside_tile_icons_7_erq0rn.png",
                  arrayInfo   : [{
                        infoTitle   : "Book & Get Cashback On Every Payment",
                        infoMessage : ["Earn 10% B-Cash (max ₹500) on every app digital payment (5% on app cash payment) & and enjoy a cashless transaction on your next visit"],
                        buttonMessage:[" "],
                        infoIcon    :  "http://res.cloudinary.com/dyqcevdpm/image/upload/v1506515474/giftbox_1_1_uqnlgc.png",
                        tnc         : ["T&C:","Earn Max. 500 B-Cash Via 10% Cashback" ,"Get 10% Cashback In Terms Of B-Cash."],
                         buttons     : [{
                                buttonTitle   : 'BOOK NOW',
                                buttonAction  : 'book',
                                buttonColor   : 'red',
                        }],

                      }]
                    },
                    
                // {
                //   insideTitle : "Facebook Check-In",
                //   insideImage : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1508767529/fb_icon_z9xj6c.png",
                //   arrayInfo   : [{
                //         infoTitle   : "100 B-Cash On Facebook Check-In",
                //         infoMessage : ["Check In On Facebook While You Are At The Salon To Earn 100 B-Cash."],
                //         buttonMessage :[" "],
                //         infoIcon    :  "http://res.cloudinary.com/dyqcevdpm/image/upload/v1506515474/giftbox_1_1_uqnlgc.png",
                //         tnc         : ["T&C:","100 B-Cash To Be Earned Only If You Check-in On The Same Day Of Your Appointment."],
                //         buttons     : [],

                //   }]
                // },
                {
                  insideTitle : 'Review And Earn',
                  insideImage : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1505220532/freebie_inside_tile_icons_5_yjzbho.png',
                  arrayInfo   : [{
                        infoTitle   : "Review And Get 25 B-Cash ",
                        infoMessage : ["Go To Completed Appointments In Profile Section And Share Your Experience Of The Services Availed To Earn 25 B-Cash. Share with us your detailed experience at the salon and grab an awesome free service!"],
                        buttonMessage:[" "],
                        infoIcon    :  "http://res.cloudinary.com/dyqcevdpm/image/upload/v1506515474/giftbox_1_1_uqnlgc.png",
                        tnc         : ["T&C:","1 free Haircut on 3 featured reviews"],
                        buttons     : [],

                  }]
                }
                
                ]
            });
         } else {

          data.push({
                title     : 'Use Your B-Cash',
                message   : 'Go Cashless This Time! Save Your Wallet Money & Redeem B-Cash On Your Total Bill Value.',
                 image     : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1507898086/redeem_ur_points_freebie_yellow_repeats_5_x1iqyk.png',
                insideArray : [{
                  insideTitle : "On ₹ 500 Bill Value",
                  insideImage : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1506511267/Redeem_your_points-_billing_above_2k_gg9yko.png",
                  arrayInfo   : [{
                        infoTitle   : "Redeem B-Cash On Digital Payments",
                        infoMessage : ["Redeem ₹ 50 On Digital Payments Through The App."],
                        buttonMessage:[" "],
                        infoIcon    :  "http://res.cloudinary.com/dyqcevdpm/image/upload/v1506515474/giftbox_1_1_uqnlgc.png",
                        tnc         : ["T&C:","Redeem B-Cash Max. Twice a Day And Thrice a Month.","B-Cash To Expire By The End Of 30 Days(from Earning)."],
                         buttons     : [{
                                buttonTitle   : 'BOOK NOW',
                                buttonAction  : 'book',
                                buttonColor   : 'red',
                        }],

                  }]
                },
                {
                  insideTitle : 'On ₹ 1000 Bill Value',
                  insideImage : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1506511267/Redeem_your_points-_billing_above_2k_gg9yko.png',
                  arrayInfo   : [{
                        infoTitle   : "Redeem B-Cash On Digital Payments",
                        infoMessage : ["Redeem ₹ 100 On Digital Payments Through The App."],
                        buttonMessage:[" "],
                        infoIcon    :  "http://res.cloudinary.com/dyqcevdpm/image/upload/v1506515474/giftbox_1_1_uqnlgc.png",
                        tnc         : ["T&C:","Redeem B-Cash Max. Twice a Day And Thrice a Month.","B-Cash To Expire By The End Of 30 Days(from Earning)."],
                         buttons     : [{
                                buttonTitle   : 'BOOK NOW',
                                buttonAction  : 'book',
                                buttonColor   : 'red',
                        }],

                  }]
                },
                {
                  insideTitle : 'On ₹ 2000 Bill Value',
                  insideImage : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1506511267/Redeem_your_points-_billing_above_2k_gg9yko.png',
                  arrayInfo   : [{
                        infoTitle   : "Redeem B-Cash On Digital Payments",
                        infoMessage : ["Redeem ₹ 200 On Digital Payments Through The App."],
                        buttonMessage:[" "],
                        infoIcon    :  "http://res.cloudinary.com/dyqcevdpm/image/upload/v1506515474/giftbox_1_1_uqnlgc.png",
                        tnc         : ["T&C:","Redeem B-Cash Max. Twice a Day And Thrice a Month.","B-Cash To Expire By The End Of 30 Days(from Earning)."],
                         buttons     : [{
                                buttonTitle   : 'BOOK NOW',
                                buttonAction  : 'book',
                                buttonColor   : 'red',
                        }],

                  }]
                },
                {
                  insideTitle : 'On ₹ 5000 Bill Value',
                  insideImage : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1506511267/Redeem_your_points-_billing_above_2k_gg9yko.png',
                  arrayInfo   : [{
                        infoTitle   : "Redeem B-Cash On Digital Payments",
                        infoMessage : ["Redeem ₹ 500 On Digital Payments Through The App."],
                        buttonMessage:[" "],
                        infoIcon    :  "http://res.cloudinary.com/dyqcevdpm/image/upload/v1506515474/giftbox_1_1_uqnlgc.png",
                        tnc         : ["T&C:","Redeem B-Cash Max. Twice a Day And Thrice a Month.","B-Cash To Expire By The End Of 30 Days(from Earning)."],
                         buttons     : [{
                                buttonTitle   : 'BOOK NOW',
                                buttonAction  : 'book',
                                buttonColor   : 'red',
                        }],

                  }]
                }]
            });


          data.push({
                title     : 'Earn B-Cash ',
                message   : 'Earn B-Cash By Digital Payments, Facebook Check-In, Sharing Your Reviews, etc And Redeem Them To Save Upto 25% On Your App Payments.',
                image     : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1507898038/refer_n_earn_freebie_yellow_repeats_2_nqzcco.png',
                insideArray : [
                {
                  insideTitle : "Digital Payment",
                  insideImage : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1505218535/freebie_inside_tile_icons_7_erq0rn.png",
                  arrayInfo   : [{
                        infoTitle   : "Book & Get Cashback On Digital Payments",
                        infoMessage : ["Book Any Service And Get 10% Cashback On Your Digital Payments Through the App. (Once Your Appointment Is Completed)."],
                        buttonMessage:[" "],
                        infoIcon    :  "http://res.cloudinary.com/dyqcevdpm/image/upload/v1506515474/giftbox_1_1_uqnlgc.png",
                        tnc         : ["T&C:","Earn Max. 500 B-Cash Via 10% Cashback" ,"Get 10% Cashback In Terms Of B-Cash."],
                         buttons     : [{
                                buttonTitle   : 'BOOK NOW',
                                buttonAction  : 'book',
                                buttonColor   : 'red',
                        }],

                      }]
                    },
                    // {
                    //   insideTitle : 'Cash Payments',
                    //   insideImage : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1505218686/freebie_inside_tile_icons_3_g9w0js.png',
                    //   arrayInfo   : [{
                    //         infoTitle   : "Book & Get Cashback On Cash Payments Through App",
                    //         infoMessage : ["Book Any Service And Get 50% Cashback On Your Cash Payment And 5% Cashback From Your 2nd Payment Onwards, Through The App. (Once Your Appointment Is Completed)."],
                    //         buttonMessage:[" "],
                    //         infoIcon    :  "http://res.cloudinary.com/dyqcevdpm/image/upload/v1506515474/giftbox_1_1_uqnlgc.png",
                    //         tnc         : ["T&C:","Get 50% Cashback In Terms Of B-Cash."],
                    //          buttons     : [{
                    //                 buttonTitle   : 'BOOK NOW',
                    //                 buttonAction  : 'book',
                    //                 buttonColor   : 'red',
                    //         }],

                    //   }]
                    // },
                // {
                //   insideTitle : "Facebook Check-In",
                //   insideImage : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1508767529/fb_icon_z9xj6c.png",
                //   arrayInfo   : [{
                //         infoTitle   : "100 B-Cash On Facebook Check-In",
                //         infoMessage : ["Check In On Facebook While You Are At The Salon To Earn 100 B-Cash."],
                //         buttonMessage :[" "],
                //         infoIcon    :  "http://res.cloudinary.com/dyqcevdpm/image/upload/v1506515474/giftbox_1_1_uqnlgc.png",
                //         tnc         : ["T&C:","100 B-Cash To Be Earned Only If You Check-in On The Same Day Of Your Appointment."],
                //         buttons     : [],

                //   }]
                // },
                {
                  insideTitle : 'Review And Earn',
                  insideImage : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1505220532/freebie_inside_tile_icons_5_yjzbho.png',
                  arrayInfo   : [{
                        infoTitle   : "Review And Get 25 B-Cash ",
                        infoMessage : ["Go To Completed Appointments In Profile Section And Share Your Experience Of The Services Availed To Earn 25 B-Cash. Share with us your detailed experience at the salon and grab an awesome free service!"],
                        buttonMessage:[" "],
                        infoIcon    :  "http://res.cloudinary.com/dyqcevdpm/image/upload/v1506515474/giftbox_1_1_uqnlgc.png",
                        tnc         : ["T&C:","1 free Haircut on 3 featured reviews"],
                        buttons     : [],

                  }]
                }
                
                ]
            });

           }

            data.push({
                title     : 'Office Email ID Benefits',
                message   : 'Add Your Office Email ID And Rejoice To Our Unheard Corporate Benefits!',
                image     : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1507898181/corporate_email_ID_benefits_freebie_yellow_repeats_8_mmog4w.png',
                insideArray : [
                 {
                  insideTitle : 'Add Office Email ID',
                  insideImage : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1505303346/freebie_inside_tile_icons_2_cyq8n7.png",
                  arrayInfo   : [{
                        infoTitle   : "Enjoy FREE Services Worth Rs 500",
                        infoMessage : ["Add Your Office Email ID And Get 1 Month Free Subscription Trial, Where You Can Enjoy Rs 500 Worth Services For FREE At Any Be U Outlet, Within 30 Days."],
                        buttonMessage:[" "],
                        infoIcon    :  "http://res.cloudinary.com/dyqcevdpm/image/upload/v1506515474/giftbox_1_1_uqnlgc.png",
                        tnc         : [],
                        buttons     : [{
                                buttonTitle   : 'ADD OFFICE EMAIL ID',
                                buttonAction  : 'corporate',
                                buttonColor   : 'red',
                        }],

                  }]
                },

                
                ]
            });

            
            data.push({
                title     : 'Terms & Conditions',
                message   : 'Please Ensure That You Have Read The Terms And Conditions Carefully In Order To Use These Service.',
                image     : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1505220084/freebie_icons_8_ccnr72.png',
                insideArray : [{
                  insideTitle : "B-Cash T&C",
                  insideImage : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1505220304/freebie_inside_tile_icons_6_xhknau.png",
                  arrayInfo   : [{
                        infoTitle   : "Make Sure You Understand Our B-Cash Before Booking Any Of Our Services.",
                        infoMessage : ["Get Free Classic Express Wax- Her/ Free Haircut - Him, On a Min. Bill Value Of ₹ 500.","Expires 30 days of Earning.","View T&C"],
                        buttonMessage:[" "],
                        infoIcon    :  "http://res.cloudinary.com/dyqcevdpm/image/upload/v1506515474/giftbox_1_1_uqnlgc.png",
                        tnc         : [],
                        buttons     : [],

                  }]
                }
                ]
            });


        return data;
    },

     getDiscountRules: function(){
      var data = [];
      data.push({
        min : 800,
        max : 5000,
        excludeNoOfServiceAmount : 4000,
        discountPercent : 5,
        text : "Current Package Benefit: Additional 5% Package Discount",
        minNoOfService : 4,
        validity : "1 month",
        validityNoOfMonth : 1,
      });
      data.push({
        min : 5000,
        max : 10000,
        discountPercent : 7,
        excludeNoOfServiceAmount : 10000,
        text : "Current Package Benefit: Additional 7% Package Discount",
        minNoOfService : 4,
        validity : "3 month",
        validityNoOfMonth : 3,
      });
      data.push({
        min : 10000,
        max : 100000,
        discountPercent : 10,
        excludeNoOfServiceAmount : 100000,
        text : "Current Package Benefit: Additional 10% Package Discount",
        minNoOfService : 4,
        validity : "6 month",
        validityNoOfMonth : 6,
      });
      return data;
    },

    minimumNoOfServiceForNewPackage: function(isNewPackage2){
        return isNewPackage2 ? 10000 : 4;
    },

    minimumServiceValueForNewPackage: function(isNewPackage2){
        return isNewPackage2 ? 10000000 : 800;
    },
    excludeNoOfServiceAmountForNewPackage : function(isNewPackage2){
      return isNewPackage2 ? 100000000 : 4000;
    },

    slabsFoPackage: function(){
        var data = [];
        data.push({
          id : 1,
          ranges : [{range1 : 800, range2 : 5000, discount : 0, validityNoOfMonth : 1},{range1 : 5000, range2 : 10000, discount : 0, validityNoOfMonth : 3},{range1 : 10000, range2 : 100000, discount : 0, validityNoOfMonth : 6}]
        });
        return data;
    },


    getPackageCarousel: function(gender){
        var data = [];
        if(gender == "F"){
          data.push({
              // imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1512041466/app_banner_size_Family_wallet_5_zwoyvn.png",
              imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1513747007/app_banner_18_fzmjx2.png",
              action : "membership",
              name : "",
              menuPrice : 0,
              dealPrice : 0,
              saveUpto : 0,
              daelId : 0,
              dealDepartment : "",
              tabIndex : 0,
              clickPage : "deal"

          });
          data.push({
              // imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1510833537/app_banner_size_nov3_10_jf30kq.png",
              imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1513746913/app_banner_17_s0e4fd.png",
              action : "freebies",
              name : "",
              menuPrice : 0,
              dealPrice : 0,
              saveUpto : 0,
              daelId : 0,
              dealDepartment : "",
              tabIndex : 0,
              clickPage : "deal"
          });
        }else{
          data.push({
              // imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1512041466/app_banner_size_Family_wallet_5_zwoyvn.png",
              imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1513747007/app_banner_18_fzmjx2.png",
              action : "membership",
              name : "",
              menuPrice : 0,
              dealPrice : 0,
              saveUpto : 0,
              daelId : 0,
              dealDepartment : "",
              tabIndex : 0,
              clickPage : "deal"

          });
          data.push({
              // imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1510833537/app_banner_size_nov3_10_jf30kq.png",
              imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1513746913/app_banner_17_s0e4fd.png",
              action : "freebies",
              name : "",
              menuPrice : 0,
              dealPrice : 0,
              saveUpto : 0,
              daelId : 0,
              dealDepartment : "",
              tabIndex : 0,
              clickPage : "deal"
          });
        }
        return {
            type : 'package',
            title : 'Discover Our Package',
            list : data,
        };
    },

    getFreebieScoreCard: function(gender, loyalityPoints,couponCodes , freeService , wallet ,subscription, freebieExpiry , subscriptionValidity , subscriptionBuyDate){
      
      var data = [{loyalityPoints:0,coupons:0,freeServices:0,familyWallet:0,subscription:0 ,freebieExpiry : null, freeServiceExpiry : null , subscriptionExpiry : null ,couponExpiry : null}];
      
      var coupons =_.filter(couponCodes , function(cc){return cc.active ==  true});
      var latestCoupon = coupons[coupons.length - 1]
      
      console.log('latest' , latestCoupon)
      
      if(loyalityPoints>0){
        data[0].loyalityPoints = loyalityPoints
        data[0].freebieExpiry = freebieExpiry
      };

      if(!subscription && coupons.length>0){
        data[0].coupons = coupons.length;
        data[0].couponExpiry = latestCoupon.expires_at
      }
      if(freeService && freeService.length>0){
        var latestFreeService = freeService[freeService.length - 1]
        data[0].freeServices = freeService.length
        data[0].freeServiceExpiry = latestFreeService.expires_at
      }
      if(wallet && wallet.creditsLeft > 0)data[0].familyWallet = wallet.creditsLeft;
      data[0].subscription = subscription;
      
      if(subscription){
        var subscriptionDate = ParlorService.getSubscriptionStartEndDate(subscriptionBuyDate, subscriptionValidity)
        var monthNames = ["Jan", "Feb", "Mar", "April", "May", "June","July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        data[0].subscriptionExpiry = subscriptionDate.monthlyBalanceEnd;
      }
      
      return {
            type : 'freebies',
            title : 'My B-Cash',
            list : data,
        };
    },

    getHomePageSubscriberText: function(){
          var data = [];
           data.push({
                    cardTitle: "Introductory Price",
                    title: "SalonPass",
                    heading1: "Enjoy",
                    heading1HTML: '<span style="color: #b98d00;font-size: 0.9em;font-weight: 600;"> Enjoy </span>',
                    heading2: "Free Services of ₹ 500/Month",
                    heading2HTML: '<span style="color: #b98d00;font-size: 0.9em;font-weight: 600;">Free Services of &#x20B9; 500/Month</span>',
                    points: ["Total Free Services Worth ₹ 6000","Get Free Services of ₹ 500 Every Calendar Month for 1 Year"],
                    recommended: "F",
                    amount: 1699,
                    realPrice : 1699,
                    subscriptionId:1,
                    priceRange : ConstantService.getPriceRangeForSubscriptionPrice()
            });
           return {
                type : 'subscription',
                title : 'SUBSCRIPTIONS',
                subscriptionCount: '<div style="text-align:right"><span style="color:#000000;font-size:0.5em;">Only 3500 of the 10000 subscriptions <br>remaining at <span  style="color:#D50000;font-size:0.5em;">Introductory Price</span></span></div>',
                list : data,
            };
    },

    getGiveSubscriptionDetail: function(subscriptionSale, subscriptionGiftHistory){
        let data = {
            type : 'giftnrefer',
            title : 'SUBSCRIPTIONS',
        }
        if(subscriptionSale && subscriptionSale.actualPricePaid != 0 && subscriptionGiftHistory<5){
            data.giftObj = {
                title : "GIFT",
                type : "gift",
                message : "Share 1 month subscription with 5 unique friends, where they get Rs. 500 worth free services as a free trial for that month.",
                noOfTrialLeft : 5 - subscriptionGiftHistory,
                referalMessage : "Hey, Enjoy free services worth Rs 500/month by subscribing to Be U salon’s annual subscription like me. I have gifted you a 1 month free trial, so download the app through this link & activate your free trial now.: "
            }
        }
        if(subscriptionSale && subscriptionSale.actualPricePaid>5){
          data.referObj = {
            title : "REFER & EARN",
            type : "refer",
            message : "When your friend buys subscription with your referral code, you both earn/save Rs. 200, on each referral",
            referalMessage : "Save Rs 200 on your Be U Annual Subscription (pay Rs 1699 & enjoy free services worth Rs 500/month, for 1 full year) purchase by using my referral code @@ "
          }
        }
        if(!data.referObj && !data.giftObj)return null
        return data;
    },

    getHomePageSubscriptions: function(earlyBirdOfferType ,gender ,soldSubscriptions, parlorType){
       var data = [];
       var count =(2500-soldSubscriptions);
       var subscriptionLoyality = 500;
       if(parlorType == 4)subscriptionLoyality = 300;
       var cutPrice = 1699;
       var p = ConstantService.getEarlyBirdOfferGlodSubscriptionPrice(earlyBirdOfferType);
       if(p==1699)cutPrice = 3000;
       data.push({
                cardTitle: earlyBirdOfferType ? "Early Bird" : "Introductory Price",
                title: "SalonPass",
                heading1: "Pay "+ConstantService.getEarlyBirdOfferGlodSubscriptionPrice(earlyBirdOfferType)+" & Enjoy",
                heading1HTML: '<span style="color: #b98d00;font-size: 0.9em;font-weight: 600;"> Pay &#x20B9; '+ConstantService.getEarlyBirdOfferGlodSubscriptionPrice(earlyBirdOfferType)+' (<span><strike style="color:black;"><span style="color:#b98d00">&#x20B9; '+cutPrice+'</span> </strike></span>)  &amp; Enjoy </span>',
                heading2: "Free Services of ₹ "+subscriptionLoyality+"/Month",
                heading2HTML: '<span style="color: #b98d00;font-size: 0.9em;font-weight: 600;">Free Services of &#x20B9; '+subscriptionLoyality+'/Month</span>',
                points: ["Total Free Services Worth ₹ 6000","Get Free Services of ₹ 500 Every Calendar Month for 1 Year"],
                recommended: "F",
                amount: 1699,
                realPrice : 1699,
                subscriptionId:1,
        });

      data.push({
              cardTitle:  "Introductory Price",
              title:  "SalonPass",
              heading1: "Pay 899 & Enjoy",
              heading1HTML: '<span style="color: #b98d00;font-size: 0.9em;font-weight: 600;">Pay &#x20B9;899 (<span><strike style="color:black;"><span style="color:#b98d00">&#x20B9; 1199</span> </strike></span>)  &amp; Enjoy</span>',
              heading2: "Free Services of ₹ 200/Month",
              heading2HTML: '<span style="color: #b98d00;font-size: 0.9em;font-weight: 600;">Free Services of &#x20B9; 200/Month</span>',
              points: ["Total Free Services Worth ₹ 2400","Get Free Services of ₹ 200 Every Calendar Month for 1 Year"],
              recommended: "M",
              amount: 899,
              realPrice : 899,
              subscriptionId:2,
      });



       return {
            type : 'subscription',
            title : 'SUBSCRIPTIONS',
            subscriptionCount: '<div style="text-align:right"><span style="color:#000000;font-size:0.5em;">Only 3500 of the 10000 subscriptions <br>remaining at <span  style="color:#D50000;font-size:0.5em;">Introductory Price</span></span></div>',
            list : data,
        };
    },

    getPriceRangeForSubscriptionPrice: function(){
        return [{price : 1199, subtotal : 3000},{price : 1699, subtotal : 0} ]
    },

    getHomePageSubscriptions2: function(earlyBirdOfferType ,gender ,soldSubscriptions, parlorType, parlorLiveDate){
       var data = [];
       var count =(2500-soldSubscriptions);
       var subscriptionLoyality = 500;
       if(parlorType == 4 && (parlorLiveDate < new Date(2018, 11, 1)))subscriptionLoyality = 500;
       var cutPrice = 3000;
       var p = ConstantService.getEarlyBirdOfferGlodSubscriptionPrice(earlyBirdOfferType);
       if(p==1699)cutPrice = 3000;
       data.push({
                cardTitle: earlyBirdOfferType ? "Early Bird" : "Introductory Price",
                title: "SalonPass",
                heading1: "Pay 1699 & Enjoy",
                heading1HTML: '<span style="color: #b98d00;font-size: 0.9em;font-weight: 600;"> Pay &#x20B9;1699 (<span><strike style="color:black;"><span style="color:#b98d00">&#x20B9; '+cutPrice+'</span> </strike></span>)  &amp; Enjoy </span>',
                // heading1: "Pay "+ConstantService.getEarlyBirdOfferGlodSubscriptionPrice(earlyBirdOfferType)+" & Enjoy",
                // heading1HTML: '<span style="color: #b98d00;font-size: 0.9em;font-weight: 600;"> Pay &#x20B9; '+ConstantService.getEarlyBirdOfferGlodSubscriptionPrice(earlyBirdOfferType)+' (<span><strike style="color:black;"><span style="color:#b98d00">&#x20B9; '+cutPrice+'</span> </strike></span>)  &amp; Enjoy </span>',
                heading2: "Free Services of ₹ "+subscriptionLoyality+"/Month",
                heading2HTML: '<span style="color: #b98d00;font-size: 0.9em;font-weight: 600;">Free Services of &#x20B9; '+subscriptionLoyality+'/Month</span>',
                points: ["Total Free Services Worth ₹ 6000","Get Free Services of ₹ 500 Every Calendar Month for 1 Year"],
                recommended: "F",
                amount: 1699,
                realPrice : 1699,
                subscriptionId:1,
                priceRange : ConstantService.getPriceRangeForSubscriptionPrice()
        });

      data.push({
              cardTitle:  "Introductory Price",
              title:  "SalonPass",
              heading1: "Pay 899 & Enjoy",
              heading1HTML: '<span style="color: #b98d00;font-size: 0.9em;font-weight: 600;">Pay &#x20B9;899 (<span><strike style="color:black;"><span style="color:#b98d00">&#x20B9; 1199</span> </strike></span>)  &amp; Enjoy</span>',
              heading2: "Free Services of ₹ 200/Month",
              heading2HTML: '<span style="color: #b98d00;font-size: 0.9em;font-weight: 600;">Free Services of &#x20B9; 200/Month</span>',
              points: ["Total Free Services Worth ₹ 2400","Get Free Services of ₹ 200 Every Calendar Month for 1 Year"],
              recommended: "M",
              amount: 899,
              realPrice : 899,
              subscriptionId:2,
      });



       return {
            type : 'subscription',
            title : 'SUBSCRIPTIONS',
            subscriptionCount: '<div style="text-align:right"><span style="color:#000000;font-size:0.5em;">Only 3500 of the 10000 subscriptions <br>remaining at <span  style="color:#D50000;font-size:0.5em;">Introductory Price</span></span></div>',
            list : data,
        };
    },


    getSubscriptionCard: function(gender ,soldSubscriptions){
      var data = {};
      var count = (2500-soldSubscriptions);
        data.detail = {
            heading1 : "Pay Once & Enjoy",
            heading2 : "HandsFree Salon Experience",
            lightDetail : "Every Month Across 80+ Salons for 1 Year",
            tnc:["\u2022 Valid on all services " , "\u2022 Valid on existing deals ", "\u2022 Valid on all days " , "\u2022 Choose different salon every time "],
          };

          data.selectSubscription = {
              title: "Select Your Subscription",
              extraOffText : '<div style="color: #64a422;font-size:.8em;font-weight: 700;text-align:center">Get ₹ 200 off on your SalonPass subscription price if you use a referral code to subscribe.</div>',
              isSubscribed : false,
              subscribedData:{},
              tile:[{
                        title: "GOLD",
                        heading1: "Pay 1699 & Enjoy",
                        heading1HTML: '<span style="color: #b98d00;font-size: 0.9em;font-weight: 600;"> Pay &#x20B9; 1699 (<span><strike style="color:black;"><span style="color:#b98d00">&#x20B9; 2999</span> </strike></span>)  &amp; Enjoy </span>',
                        heading2: "Free Services of ₹ 500/Month",
                        heading2HTML: '<span style="color: #b98d00;font-size: 0.9em;font-weight: 600;">Free Services of &#x20B9; 500/Month</span>',
                        points: ["Total Free Services Worth ₹ 6000","Get Free Services of ₹ 500 Every Calendar Month for 1 Year"],
                        recommended: "F",
                        amount: 1699,
                        cutPrice : 2499,
                        subscriptionId:1,
                    },{
                        title: "SILVER",
                        heading1: "Pay 899 & Enjoy",
                        heading1HTML: '<span style="color: #b98d00;font-size: 0.9em;font-weight: 600;">Pay &#x20B9;899 (<span><strike style="color:black;"><span style="color:#b98d00">&#x20B9; 1199</span> </strike></span>)  &amp; Enjoy</span>',
                        heading2: "Free Services of ₹ 200/Month",
                        heading2HTML: '<span style="color: #b98d00;font-size: 0.9em;font-weight: 600;">Free Services of &#x20B9; 200/Month</span>',
                        points: ["Total Free Services Worth ₹ 2400","Get Free Services of ₹ 200 Every Calendar Month for 1 Year"],
                        recommended: "M",
                        amount: 899,
                        cutPrice: 1299,
                        subscriptionId:2,
                    }
              ],
              subscriptionCount: '<div style="text-align:center"><span style="color:#757575;font-size:0.5em;">Only 3500 of the 10000 subscriptions <br>remaining at <span  style="color:#D50000;font-size:0.5em;">Introductory Price</span></span></div>'
          };

          data.subscriptionFeatures = {
            heading : "<div style='color: #cc0000'>SalonPass Subscriber Features<div>",
            features : '<div>&#x20B9;500 FREE/Month &#x25CF;FLASH SALE &#x25CF;10% Product Discount WiFi &#x25CF;Music</div>',
          };

          data.availSteps = {
            heading : "How To Redeem SalonPass Balance At Partner Be U Salons",
            steps :[{
              icon :"https://res.cloudinary.com/dyqcevdpm/image/upload/v1516865961/step_1_qhcwgn.png",
              title:"STEP 1",
              content : "Select your services on our app and while you checkout at Payment Confirmation page, select 'Use SalonPass Balance'. OR During payment at any Be U Partner salon, inform the manager about your SalonPass and he will confirm it through an OTP on your registered mobile number. And your SalonPass balance will be redeemed.",
            },
            {
              icon: "https://res.cloudinary.com/dyqcevdpm/image/upload/v1516866040/step_2_w7mcjw.png",
              title:"STEP 2",
              content : "Repeat STEP 1 for 12 Months of your remaining subscription and continue enjoying your HandsFree Salon Experience.",
            }]
          };

          data.faq = {
            heading : "Frequently Asked Questions",
            questions :[    
                  {
                      question : "How do I know which month and day my SalonPass would start and end??",
                      answer : "Your SalonPass monthly balance cycle starts from the date you purchase it on or renew it on, and expires at end of every month on that date.",
                  },
                  {
                      question : "If I book next month’s appointment, which month’s balance would be used for it? the booking month? OR the appointment month?",
                      answer :  "The appointment month balance would be used, in which your service is availed."
                  },
                  {
                      question : "In my SalonPass balance, how much is service value and how much is the tax amount?",
                      answer : "Be U follows all inclusive rates for everything. If your SalonPass balance is Rs 500, then Rs 500 will be reduced from your final bill. Say your final bill is Rs 1200 including taxes, then after using your SalonPass balance your your final bill will be Rs 700.",
                  },
                  {
                      question : "If I have used only ₹ 200* from my balance in a month, can the remaining be transferred to the next month?",
                      answer : "No. You have to consume each month’s balance in that respective month itself.",
                  },
                  {
                      question : "Can I spend more than the monthly limit in a particular month and How?",
                      answer : "Yes, you can. You can spend as much as you like. On the payment confirmation page select “Redeem SalonPass Balance” which will adjust the SalonPass balance and the remaining amount can be paid through your credit card or cash on the app or at the salon.",
                  },
                  {
                      question : "Am I eligible for the other ongoing Be U deals through the SalonPass balance?",
                      answer : "Yes. SalonPass is just your monthly money which can be spent on existing deals and packages of a salon. SalonPass balance can not be availed along with B-Cash, Other coupons and Flash Sale.",
                  },
                  {
                      question : "Can my friends/relatives use my monthly SalonPass balance?",
                      answer : "No. One SalonPass is limited to one person only (the registered mobile number) and is non-refundable and non-transferable.",
                  },
                  {
                      question : "Can I cancel my SalonPass after buying it?",
                      answer : "No. SalonPass is non refundable and non transferable.",
                  },
                  {
                      question : "How would I receive the amount from my referrals?",
                      answer : "Via the same mode of payment which you purchased your SalonPass from. But in case of cash, you will receive it via PayTM (if you don’t have a PayTM account, you will not receive your refund amount).",
                  }
                ],
            tnc : ["refers to Gold SalonPass Plan"]
          };
        return data;
    },


    getSubscriptionCardNew: function(gender ,soldSubscriptions){
        var data = {};
        var count = (2500-soldSubscriptions);
          data.detail = {
              heading1 : "Pay Once & Enjoy",
              heading2 : "HandsFree Salon Experience",
              lightDetail : "Every Month Across 80+ Salons for 1 Year",
              tnc:["\u2022 Valid on all services " , "\u2022 Valid on existing deals ", "\u2022 Valid on all days " , "\u2022 Choose different salon every time "],
            };
  
            data.selectSubscription = {
                title: "Select Your Subscription",
                extraOffText : '<div style="color: #64a422;font-size:.8em;font-weight: 700;text-align:center">Get ₹ 200 off on your SalonPass subscription price if you use a referral code to subscribe.</div>',
                isSubscribed : false,
                subscribedData:{},
                tile:[{
                          title: "GOLD",
                          heading1: "Pay 1699 & Enjoy",
                          heading1HTML: '<span style="color: #b98d00;font-size: 0.9em;font-weight: 600;"> Pay &#x20B9; 1699 (<span><strike style="color:black;"><span style="color:#b98d00">&#x20B9; 2999</span> </strike></span>)  &amp; Enjoy </span>',
                          heading2: "Free Services of ₹ 500/Month",
                          heading2HTML: '<span style="color: #b98d00;font-size: 0.9em;font-weight: 600;">Free Services of &#x20B9; 500/Month</span>',
                          points: ["Total Free Services Worth ₹ 6000","Get Free Services of ₹ 500 Every Calendar Month for 1 Year"],
                          recommended: "F",
                          amount: 1699,
                          cutPrice : 2499,
                          subscriptionId:1,
                      }
                ],
                subscriptionCount: '<div style="text-align:center"><span style="color:#757575;font-size:0.5em;">Only 3500 of the 10000 subscriptions <br>remaining at <span  style="color:#D50000;font-size:0.5em;">Introductory Price</span></span></div>'
            };
  
            data.subscriptionFeatures = {
              heading : "<div style='color: #cc0000'>SalonPass Subscriber Features<div>",
              features : '<div>&#x20B9;500 FREE/Month &#x25CF;FLASH SALE &#x25CF;10% Product Discount WiFi &#x25CF;Music</div>',
            };
  
            data.availSteps = {
              heading : "How To Redeem SalonPass Balance At Partner Be U Salons",
              steps :[{
                icon :"https://res.cloudinary.com/dyqcevdpm/image/upload/v1516865961/step_1_qhcwgn.png",
                title:"STEP 1",
                content : "Select your services on our app and while you checkout at Payment Confirmation page, select 'Use SalonPass Balance'. OR During payment at any Be U Partner salon, inform the manager about your SalonPass and he will confirm it through an OTP on your registered mobile number. And your SalonPass balance will be redeemed.",
              },
              {
                icon: "https://res.cloudinary.com/dyqcevdpm/image/upload/v1516866040/step_2_w7mcjw.png",
                title:"STEP 2",
                content : "Repeat STEP 1 for 12 Months of your remaining subscription and continue enjoying your HandsFree Salon Experience.",
              }]
            };
  
            data.faq = {
              heading : "Frequently Asked Questions",
              questions :[    
                    {
                        question : "How do I know which month and day my SalonPass would start and end??",
                        answer : "Your SalonPass monthly balance cycle starts from the date you purchase it on or renew it on, and expires at end of every month on that date.",
                    },
                    {
                        question : "If I book next month’s appointment, which month’s balance would be used for it? the booking month? OR the appointment month?",
                        answer :  "The appointment month balance would be used, in which your service is availed."
                    },
                    {
                        question : "In my SalonPass balance, how much is service value and how much is the tax amount?",
                        answer : "Be U follows all inclusive rates for everything. If your SalonPass balance is Rs 500, then Rs 500 will be reduced from your final bill. Say your final bill is Rs 1200 including taxes, then after using your SalonPass balance your your final bill will be Rs 700.",
                    },
                    {
                        question : "If I have used only ₹ 200* from my balance in a month, can the remaining be transferred to the next month?",
                        answer : "No. You have to consume each month’s balance in that respective month itself.",
                    },
                    {
                        question : "Can I spend more than the monthly limit in a particular month and How?",
                        answer : "Yes, you can. You can spend as much as you like. On the payment confirmation page select “Redeem SalonPass Balance” which will adjust the SalonPass balance and the remaining amount can be paid through your credit card or cash on the app or at the salon.",
                    },
                    {
                        question : "Am I eligible for the other ongoing Be U deals through the SalonPass balance?",
                        answer : "Yes. SalonPass is just your monthly money which can be spent on existing deals and packages of a salon. SalonPass balance can not be availed along with B-Cash, Other coupons and Flash Sale.",
                    },
                    {
                        question : "Can my friends/relatives use my monthly SalonPass balance?",
                        answer : "No. One SalonPass is limited to one person only (the registered mobile number) and is non-refundable and non-transferable.",
                    },
                    {
                        question : "Can I cancel my SalonPass after buying it?",
                        answer : "No. SalonPass is non refundable and non transferable.",
                    },
                    {
                        question : "How would I receive the amount from my referrals?",
                        answer : "Via the same mode of payment which you purchased your SalonPass from. But in case of cash, you will receive it via PayTM (if you don’t have a PayTM account, you will not receive your refund amount).",
                    }
                  ],
              tnc : ["refers to Gold SalonPass Plan"]
            };
          return data;
      },

    getDisplayDetails: function(){
        let obj = {
            spendMore : '<div style="color: #64a422;font-size:.8em;font-weight: 700;text-align:center">Add 1 Free Month To Your SalonPass Subscription Every Time You Shop Above ₹ 3000</div>',
            renewSubtitle : '<div style="color: #64a422;font-size:.8em;font-weight: 700;text-align:center">Add 1 Free Month To Your SalonPass Subscription Every Time You Shop Above ₹ 3000</div>',
            earnReferralMessage : 'Hey, Enjoy free services worth Rs 500/month by subscribing to Be U salon’s annual subscription like me. I have gifted you a 1 month free trial, so download the app through this link & activate your free trial now.: ',
            heading : 'When your friend buys subscription with your referral code, you both earn/save Rs. 200, on each referral'  ,
            heading2 : 'Share 1 month subscription with 5 unique friends, where they get Rs. 500 worth free services as a free trial for that month.'  ,
            referMessage : "Save Rs 200 on your Be U Annual Subscription (pay Rs 1699 & enjoy free services worth Rs 500/month, for 1 full year) purchase by using my referral code @@ "
        }
        return obj
    } , 

    getFirstAdBanner: function(gender , isSubscribed){
        var data = [];

        //Subscription
        // if(isSubscribed == false){
        //     data.push({
        //       // imageUrl : (gender=="M") ? "http://res.cloudinary.com/dyqcevdpm/image/upload/v1522317509/male-subscription---march_e184fw.png" : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1522317436/female-subscription---march_vovqhn.png",

        //       imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1535524495/subscription--in-1199-early-bird-offer-banner-app_ocrcbx.png",
        //       action : "subscription",
        //   });
        // }

        //   data.push({
        //     imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1520405600/womans-day-app-banner_fhpwvo.png",
        //     action : "xyz",
        // });

          //Deals
         data.push({
            imageUrl : (gender=="M") ? "http://res.cloudinary.com/dyqcevdpm/image/upload/v1551445604/App_banners_-_2019_zwtsxj.jpg" : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1551445604/App_banners_-_2019_zwtsxj.jpg",
            action : "dealPage",
        });

         //B-Cash
         data.push({
            imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1551445634/App_banners_-_20197_bj76c7.jpg",
            action : "freebies",
        });
         
         //Flat Price
         if(gender == "F"){
            data.push({
              imageUrl :"http://res.cloudinary.com/dyqcevdpm/image/upload/v1551445606/App_banners_-_20192_vcdhxg.jpg",
              action : "dealPage",
          });
         }
        
        //Coupons
        data.push({
            imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1551445628/App_banners_-_20196_a5i5gl.jpg",
            action : "freebies",
        })

        //Refer Earn
        /*data.push({
            imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1519030629/Female_male_Refer_Earn_-_top_-_last_njui38.png",
            action : "freebies",
        });*/

        return {
            type : 'firstAdBanner',
            title : 'Ad Banner',
            list : data,
        };
    },

    getSecondAdBanner: function(gender){
        var data = [];

        //Package
         data.push({
            imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1556864433/Corporate-id-benefit-APP-banners---may-2019_ygw1fa.png",
            action : "corporate",
        });

         data.push({
            imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1551445604/App_banners_-_2019_zwtsxj.jpg",
            action : "dealPage",
        });


        //Package
        //  data.push({
        //     imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1519034742/Female-_-male-customise-package_jridih.png",
        //     action : "dealPage",
        // });

         //Corporate Login
         /*data.push({
            imageUrl : (gender=="M") ? "http://res.cloudinary.com/dyqcevdpm/image/upload/v1551445622/App_banners_-_20194_wlxfsf.jpg" : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1551445622/App_banners_-_20194_wlxfsf.jpg",
            action : "corporate",
        });*/

         //Music
        /*data.push({
            imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1551445618/App_banners_-_20193_xkorla.jpg",
            action : "dealPage",
        });*/

        // //FB Checkin
        // data.push({
        //     imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1519030542/Female_male_FB_Check_In_hbf63r.png",
        //     action : "freebies",
        // });

        return {
            type : 'secondAdBanner',
            title : 'Ad Banner',
            list : data,
        };
    },

    getThirdAdBanner: function(gender){
        var data = [];

        //Review Us
         data.push({
            imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1519301693/review-new-tab_20_1_j67a2o.png",
            action : "dealPage",
        });

         //Don't Get Bill
          data.push({
            imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1520930568/no-bill-then-free-app-banner_22_y9oosj.png",
            action : "dealPage",
        });

        //FB Checkin
       /* data.push({
            imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1519030542/Female_male_FB_Check_In_hbf63r.png",
            action : "freebies",
        });*/

          //Family Wallet
        //  data.push({
        //     imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1519030486/Female_male_Family_wallet_rx8whn.png",
        //     action : "membership",
        // });

        // //Music
        // data.push({
        //     imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1519035139/Music_ui7njp.png",
        //     action : "dealPage",
        // });

        // //FB Checkin
        // data.push({
        //     imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1519030542/Female_male_FB_Check_In_hbf63r.png",
        //     action : "freebies",
        // });

        return {
            type : 'secondAdBanner',
            title : 'Ad Banner',
            list : data,
        };
    },

    getCarousel: function(){
        var data = [];
         data.push({
            // imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1512041466/app_banner_size_Family_wallet_5_zwoyvn.png",
            imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1513747007/app_banner_18_fzmjx2.png",
            action : "membership",
        });

         data.push({
            // imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1510833537/app_banner_size_nov3_10_jf30kq.png",
            imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1513746913/app_banner_17_s0e4fd.png",
            action : "freebies",
        });
        //  data.push({
        //     imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1510580736/app_banner_size_nov3_5_2_mxfrnt.png",
        //     action : "freebies",
        // });
         data.push({
            imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1512040983/app_banner_size_Family_wallet_7_rwtxbj.png",
            action : "dealPage",
        });
        data.push({
            // imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1505911770/app_banner_size_8_1_z1kq7x.png",
            imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1513746861/app_banner_16_uc5b4h.png",
            action : "dealPage",
        });

        data.push({
            imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1506410664/app_banner_size_sept_6_hwq1o0.png",
            action : "freebies",
        });
        data.push({
            imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1514029081/app_banner_size_Family_wallet_14_ztandy.png",
            action : "corporate",
        });
        // data.push({
        //     imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1506410646/app_banner_size_sept_3_n9fzhz.png",
        //     action : "membership",
        // });


       /* data.push({
            imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1505911539/app_banner_size_7_seqrlf.png",
            action : "parlors",
            selectedDeals : [
                {
                    dealType : 'dealPrice',
                    name : "sdasdasdasda",
                    brandId : "",
                    productId : "",
                    dealId : 36,
                    serviceCodes : [202],
                },
                {
                    dealType : 'dealPrice',
                    name : "sdasdasdasda",
                    brandId : "5935646e00868d2da81bb91c",
                    productId : "",
                    dealId : 1,
                    serviceCodes : [89],
                }
            ]
        });*/
        return data;
    },

    getStaticDealIdForFrequencyService : function(){
      return [154, 36, 37, 14, 47, 40, 154, 3, 2, 350];
    },

    getCorporateReferalMessage : function(referalCode){
      return {
        // message : "Download The App To Get Free Classic Express Wax- Her(Full Arms+Full Legs+Underarms)/Free Haircut- Him(On Min. Bill Value Of Rs. 500). Also Get 3 Free Haircuts & 200% Cashback On First App Payment By Adding Your Corporate Email ID. You Can Further Earn Offers Like Hair Color, Keratin, Facial, Hair Spa Etc. By Referring Your Colleagues. Enter Referral Code "+referalCode+" To Sign Up On The App. http://onelink.to/bf45qf"
        message : "I am enjoying “Corporate ID” benefits at Be U Salons. Log into Be U app and register your corporate email ID and enjoy FREE services worth Rs 500 at any of Be U’ 160+ outlets. Use my referral code 4GCLJO6 to log into Be U app to get started. Download at http://onelink.to/bf45qf"
      }
    },

    getNoramlReferalMessage :  function(referalCode , gender){
      return {
        message : 'Your friend referred you to Be U Salons so that you can enjoy FLAT 25% OFF on your 1st Be U booking (max discount Rs 500), using coupon Code '+referalCode+'.'
      }
    },

    corporateReferralServices:function(gender , referalCount, serviceId){
      var maleService = [
                          {
                              dealId : 14,
                              dealType : "chooseOne",
                              serviceCode : 386,
                              serviceId : "5883492351cbc72b34ddbbdf",
                              brandId : "594ccab23c61904155d4852a",
                              id:1,
                              name:" 5 Referrals: Upgrade 1 haircut to Classic Facial",
                              serviceName : "Classic Facial",
                              description : "Classic Facial for Men",
                              referralReduce : 5,
                              priceId:1017,
                              price : 1000,
                              menuPrice: 1800
                          },
                          {
                              dealId : 47,
                              dealType : "chooseOne",
                              serviceCode : 231,
                              priceId:231,
                              serviceId : "58707eda0901cc46c44af451",
                              brandId : "5935646e00868d2da81bb91c",
                              id:2,
                              name:"15 Referrals: Upgrade 1 haircut to Hair Spa",
                              serviceName : "Hair Spa",
                              description : "Hair Spa for Men",
                              referralReduce : 15,
                              price: 750,
                              menuPrice: 900
                          },
                          {
                              dealId : 40,
                              dealType : "chooseOne",
                              serviceCode : 60,
                              priceId:60,
                              serviceId : "58707eda0901cc46c44af2fb",
                              brandId : "5935646e00868d2da81bb91c",
                              id:3,
                              name:"25 Referrals: Upgrade 1 haircut to Expert Treatment ",
                              serviceName : "Expert Treatment",
                              description : "Expert Treatment for Men",
                              referralReduce : 25,
                              price : 800,
                              menuPrice : 1900
                          }
                      ];
      var femaleService = [
                        {
                            dealId : 154,
                            dealType : "dealPrice",
                            serviceCode : 502,
                            priceId:1565,
                            serviceId : "59520f3b64cd9509caa273ec",
                            brandId : "59520f9364cd9509caa273f2",
                            id:1,
                            name:"5 Referrals: Upgrade 1 haircut to Deluxe Express Wax",
                            serviceName : "Deluxe Express Wax",
                            description : "Deluxe Express Wax for Female",
                            referralReduce : 5,
                            price : 900,
                            menuPrice : 1500
                        },
                        {
                            dealId : 3,
                            dealType : "chooseOne",
                            serviceCode : 96,
                            priceId : 96,
                            serviceId : "58707eda0901cc46c44af343",
                            brandId : "5935646e00868d2da81bb91c",
                            productId : "593564c200868d2da81bb91f",
                            id:2,
                            name:"15 Referrals: Upgrade 1 haircut to Global Haircolor",
                            serviceName : "Global Haircolor",
                            description : "Global Haircolor for Female",
                            referralReduce : 15,
                            price : 2000,
                            menuPrice : 5000
                        },
                        {
                            dealId : 2,
                            dealType : "dealPrice",
                            serviceCode : 92,
                            priceId:92,
                            serviceId : "58707eda0901cc46c44af33b",
                            id:3,
                            name:"25 Referrals: Upgrade 1 haircut to Keratin Treatment",
                            serviceName : "Keratin",
                            description : "Keratin for Female",
                            referralReduce : 25,
                            price : 3500,
                            menuPrice : 7200
                        }
                    ];
      if (serviceId == "58707eda0901cc46c44af417" || "58707eda0901cc46c44af2eb"){
        var services = []; var flag = true;
          if(gender=="M"){

            if(referalCount >= 25){
              services = maleService

            }else if(referalCount < 25 && referalCount >= 15){
              services = maleService.splice(0,2)

            }else if(referalCount < 15 && referalCount >= 5){
              services = maleService.splice(0,1)

            }else{
              services = [];

              flag = false;
            }

          }else{

            if(referalCount >= 25){
              services = femaleService

            }else if(referalCount < 25 && referalCount >= 15){
              services = femaleService.splice(0,2)

            }else if(referalCount <15 && referalCount >= 5){
              services = femaleService.splice(0,1)

            }else{
              services = [];

              flag = false;
            }

          }
          return {
          service : services,
          enableUpgrade : flag
        }

      }else{

        return {
          service : [],
          enableUpgrade : false
        }
      }

    },

    opsIncentive :  function(){
      return {
        incentive : {
                      "levels" : [
                          {
                              "level" : "Target 1",
                              "incentives" : [
                                  {
                                      "role" : 3,
                                      "incentive" : 500
                                  },
                                  {
                                      "role" : 6,
                                      "incentive" : 250
                                  },
                                  {
                                      "role" : 12,
                                      "incentive" : 250
                                  },
                                  {
                                      "role" : 9,
                                      "incentive" : 250
                                  }
                              ]
                          },
                          {
                              "level" : "Target 2",
                              "incentives" : [
                                  {
                                      "role" : 3,
                                      "incentive" : 750
                                  },
                                  {
                                      "role" : 6,
                                      "incentive" : 375
                                  },
                                  {
                                      "role" : 12,
                                      "incentive" : 375
                                  },
                                  {
                                      "role" : 9,
                                      "incentive" : 375
                                  }
                              ]
                          },
                          {
                              "level" : "Target 3",
                              "incentives" : [
                                  {
                                      "role" : 3,
                                      "incentive" : 1000
                                  },
                                  {
                                      "role" : 6,
                                      "incentive" : 500
                                  },
                                  {
                                      "role" : 12,
                                      "incentive" : 500
                                  },
                                  {
                                      "role" : 9,
                                      "incentive" : 500
                                  }
                              ]
                          }
                      ]
                  }
      }
    },

    units : function(){
        return [
            {
                'id' : 0,
                'unitName' : 'Hair',
            },
            {
                'id' : 1,
                'unitName' : 'Beauty',
            }
            ,
            {
                'id' : 2,
                'unitName' : 'Make Up',
            }
            ,
            {
                'id' : 3,
                'unitName' : 'Hand & Feet',
            } ,
            {
                'id' : 4,
                'unitName' : 'Nail',
            }
            ,
            {
                'id' : 5,
                'unitName' : 'Spa',
            }

        ];
    },
    deepLinks : function(){
      return [
                  {
                      "parlorName": "Makers",
                      "parlorId": "593aa37c4769976f38246cfb",
                      "link": "https://goo.gl/F5i27p"
                  },
                  {
                      "parlorName": "Diya",
                      "parlorId": "592ab643c5fa213f89e83257",
                      "link": "https://goo.gl/vvqdY8"
                  },
                  {
                      "parlorName": "The Petals",
                      "parlorId": "595ca30144e0ad780f74f313",
                      "link": "https://goo.gl/CMk21d"
                  },
                  {
                      "parlorName": "Zrika",
                      "parlorId": "588998adf8169604955dcd3b",
                      "link": "https://goo.gl/Tej3G9"
                  },
                  {
                      "parlorName": "Absolute Her's",
                      "parlorId": "5954cfdcbb6e1a7dae60feb6",
                      "link": "https://goo.gl/cwD7RY"
                  },
                  {
                      "parlorName": "Felicity",
                      "parlorId": "5979c7716752187af2fa3525",
                      "link": "https://goo.gl/MD4uVD"
                  },
                  {
                      "parlorName": "The Valentine",
                      "parlorId": "5973025360925c726cfb684f",
                      "link": "https://goo.gl/xiLvix"
                  },
                  {
                      "parlorName": "Amour",
                      "parlorId": "59a7e233c6be400dc8dc5c7f",
                      "link": "https://goo.gl/jnWqgq"
                  },
                  {
                      "parlorName": "Flora",
                      "parlorId": "59f8736e4514dd4911d8cf78",
                      "link": "https://goo.gl/7exF1a"
                  },
                  {
                      "parlorName": "Hair Story",
                      "parlorId": "59f9d3e112e77376d38257e2",
                      "link": "https://goo.gl/8FWM6j"
                  },
                  {
                      "parlorName": "Mirrors",
                      "parlorId": "592a8690c5fa213f89e81f7e",
                      "link": "https://goo.gl/2vEauF"
                  },
                  {
                      "parlorName": "Curlz",
                      "parlorId": "5a40e6349bbc51303c38d179",
                      "link": "https://goo.gl/8Etnjn"
                  },
                  {
                      "parlorName": "Dorris",
                      "parlorId": "598abcdb817fd2285fe1a193",
                      "link": "https://goo.gl/1gTE8u"
                  },
                  {
                      "parlorName": "Hair Beats",
                      "parlorId": "59af955549155b2af6b22606",
                      "link": "https://goo.gl/7UsYFo"
                  },
                  {
                      "parlorName": "Beauty Lounge",
                      "parlorId": "5a3ce29e6079f61b0640852b",
                      "link": "https://goo.gl/8Gw3Jj"
                  },
                  {
                      "parlorName": "Auburn Studio",
                      "parlorId": "5a34f4c45c411f421f1421f2",
                      "link": "https://goo.gl/HPnD1L"
                  },
                  {
                      "parlorName": "Kabi",
                      "parlorId": "59a54dfd46f4a7494eac6f2f",
                      "link": "https://goo.gl/n8yTF6"
                  },
                  {
                      "parlorName": "Looks Perfect",
                      "parlorId": "59a7d95bc6be400dc8dc513d",
                      "link": "https://goo.gl/1aCVbU"
                  },
                  {
                      "parlorName": "Spirulina",
                      "parlorId": "59f06bb13fbf5862a549bb2f",
                      "link": "https://goo.gl/k1GHbf"
                  },
                  {
                      "parlorName": "Shreya Verma Makeovers",
                      "parlorId": "59a516de3e8f9a446c0037f6",
                      "link": "https://goo.gl/Bd7TDQ"
                  },
                  {
                      "parlorName": "RK Beauty Land",
                      "parlorId": "59d0fc9f8bda274cd6ddba82",
                      "link": "https://goo.gl/jms39s"
                  },
                  {
                      "parlorName": "Laban",
                      "parlorId": "59c8b0045342615cd47c704e",
                      "link": "https://goo.gl/ffGmqL"
                  },
                  {
                      "parlorName": "Hair n Shanti",
                      "parlorId": "59cc990881821532a6db7cbe",
                      "link": "https://goo.gl/d4fgBX"
                  },
                  {
                      "parlorName": "Te Amo",
                      "parlorId": "59fd7dbcbd0a022154619103",
                      "link": "https://goo.gl/5S2FVH"
                  },
                  {
                      "parlorName": "Aakura",
                      "parlorId": "59df2c9109094b62e2a39bfb",
                      "link": "https://goo.gl/EuT2ns"
                  },
                  {
                      "parlorName": "Hair & Care",
                      "parlorId": "59f42c7e315f6432739a994f",
                      "link": "https://goo.gl/DhcWKX"
                  },
                  {
                      "parlorName": "Exotic",
                      "parlorId": "5a1d13932b7d67190bcf5486",
                      "link": "https://goo.gl/rSxmmG"
                  },
                  {
                      "parlorName": "Laban",
                      "parlorId": "59c8f3ec5342615cd47c86ed",
                      "link": "https://goo.gl/SwrMfQ"
                  },
                  {
                      "parlorName": "Layba",
                      "parlorId": "5a38db4ebe14c71a59b65b82",
                      "link": "https://goo.gl/X6XEDB"
                  },
                  {
                      "parlorName": "Down Town",
                      "parlorId": "59c60feb4c797c497afda972",
                      "link": "https://goo.gl/NjjHbF"
                  },
                  {
                      "parlorName": "Crystal",
                      "parlorId": "59f877264514dd4911d8cfec",
                      "link": "https://goo.gl/9YkERz"
                  },
                  {
                      "parlorName": "Hair n Shanti",
                      "parlorId": "59ccd3a281821532a6dbbab7",
                      "link": "https://goo.gl/zGj81S"
                  },
                  {
                      "parlorName": "Adore",
                      "parlorId": "59f724e227f8536a9b199ef6",
                      "link": "https://goo.gl/7xaKTX"
                  },
                  {
                      "parlorName": "Fabb",
                      "parlorId": "5a1e874c3a1f1959a4bd0513",
                      "link": "https://goo.gl/5vty9C"
                  },
                  {
                      "parlorName": "Studio 17",
                      "parlorId": "59c644e51d15f54c476aa254",
                      "link": "https://goo.gl/6aWCCp"
                  },
                  {
                      "parlorName": "Eden wellness",
                      "parlorId": "598c0b92be37dd3df0df220a",
                      "link": "https://goo.gl/Xhx4ES"
                  },
                  {
                      "parlorName": "House Of Hair",
                      "parlorId": "59b8e147eef730256605240b",
                      "link": "https://goo.gl/sRik15"
                  },
                  {
                      "parlorName": "Aalenes",
                      "parlorId": "587088445c63a33c0af62727",
                      "link": "https://goo.gl/wccMDQ"
                  },
                  {
                      "parlorName": "Glam Impression",
                      "parlorId": "58cb9545cfd3553fa1d0dc68",
                      "link": "https://goo.gl/CHAEX4"
                  },
                  {
                      "parlorName": "Instyla",
                      "parlorId": "59f43d5c46f1296839eb1fba",
                      "link": "https://goo.gl/wRRxGi"
                  },
                  {
                      "parlorName": "Enhance",
                      "parlorId": "59fdcd8457e1062a48df7dd6",
                      "link": "https://goo.gl/9UTLN2"
                  },
                  {
                      "parlorName": "Natural",
                      "parlorId": "59c618154c797c497afdb1f0",
                      "link": "https://goo.gl/pgS4fr"
                  },
                  {
                      "parlorName": "Siddharth",
                      "parlorId": "58fdb21486377a619caa18bb",
                      "link": "https://goo.gl/uu2T5V"
                  },
                  {
                      "parlorName": "Studio 9",
                      "parlorId": "597c445e41a0840e93d89b56",
                      "link": "https://goo.gl/sfcQzT"
                  },
                  {
                      "parlorName": "Aura Looks you Desire",
                      "parlorId": "59267d599617606d79a7b899",
                      "link": "https://goo.gl/bSZLpJ"
                  },
                  {
                      "parlorName": "Natural",
                      "parlorId": "5a0ffcd301afd40ad4ba540a",
                      "link": "https://goo.gl/UGrPEV"
                  },
                  {
                      "parlorName": "The Beauty Villa",
                      "parlorId": "59f18ef570a78e39ebc77969",
                      "link": "https://goo.gl/5difLE"
                  },
                  {
                      "parlorName": "Style Code",
                      "parlorId": "58e727cf14328a4b2f3b637c",
                      "link": "https://goo.gl/9n6wjp"
                  },
                  {
                      "parlorName": "Verve",
                      "parlorId": "5905c3732f004c7cad24c3ee",
                      "link": "https://goo.gl/k3zd77"
                  },
                  {
                      "parlorName": "Manju's Salon",
                      "parlorId": "58e09a57b81c313ad0c85275",
                      "link": "https://goo.gl/Aa7QA8"
                  },
                  {
                      "parlorName": "Kabi",
                      "parlorId": "58ded8be57a5140f302bb555",
                      "link": "https://goo.gl/KqPwy5"
                  },
                  {
                      "parlorName": "Pallavi Bhatia Makeovers",
                      "parlorId": "590da3214a8649164ba2fb30",
                      "link": "https://goo.gl/6gv4Yn"
                  },
                  {
                      "parlorName": "Master's of Makeovers",
                      "parlorId": "58a2f5e13443ec15576228fe",
                      "link": "https://goo.gl/6RtX9C"
                  },
                  {
                      "parlorName": "Kabi",
                      "parlorId": "588a0cc3f8169604955dce8d",
                      "link": "https://goo.gl/MP7G7D"
                  },
                  {
                      "parlorName": "Raqs",
                      "parlorId": "58ec79be34b17264d444ce22",
                      "link": "https://goo.gl/c1ZmNH"
                  },
                  {
                      "parlorName": "Style Redefined",
                      "parlorId": "591418339a12f11bd6a6e548",
                      "link": "https://goo.gl/EJN7Ae"
                  },
                  {
                      "parlorName": "La Contoure",
                      "parlorId": "5923e21de61af441506f14ef",
                      "link": "https://goo.gl/Evaqd2"
                  },
                  {
                      "parlorName": "Studio9",
                      "parlorId": "594a27e8aa96ec738f58908c",
                      "link": "https://goo.gl/L7RjaU"
                  },
                  {
                      "parlorName": "Style Lab",
                      "parlorId": "5971b55560925c726cfb0462",
                      "link": "https://goo.gl/418XZU"
                  },
                  {
                      "parlorName": "Shagun",
                      "parlorId": "592c15bee52b257687e8d998",
                      "link": "https://goo.gl/sdvA4Q"
                  },
                  {
                      "parlorName": "Rtistic",
                      "parlorId": "597b6e8841a0840e93d88327",
                      "link": "https://goo.gl/dea6W7"
                  }
              ]
    },

    salondeals : function(){
        return [
            {
                'dealId' : 1,
                'dealImage' : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1513319542/smothening_jurtz8.jpg",
            },
            {
                'dealId' : 2,
                'dealImage' : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1513319542/keratin_mplnrr.jpg",
            },
            {
                'dealId' : 4,
                'dealImage' : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1513319542/highlights_e5rsp1.jpg",
            },
            {
                'dealId' : 3,
                'dealImage' : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1513319543/globalColors_qssu6s.jpg",
            },
            {
                'dealId' : 17,
                'dealImage' : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1513319543/waxing_akrqxv.jpg",
            },
            {
                'dealId' : 36,
                'dealImage' : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1513319543/haircut_j7zpyu.jpg",
            },
            {
                'dealId' : 37,
                'dealImage' : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1513319542/Men-Haircut_vh4cj1.jpg",
            },
            {
                'dealId' : 69,
                'dealImage' : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1513319542/Men-Shaving-Regular_gxeflp.jpg",
            },
            {
                'dealId' : 14,
                'dealImage' : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1513319542/Carlos_facial_home_zhgp1q.jpg",
            }
        ];
    },

    beforBookingCouponId: function(){
        return "594a359d9856d3158171ea4f";
    },

    getCityId: function(latitude, longitude){

       if(latitude && longitude){


        var delhiLat = 28.644800 , delhiLong = 77.216721 , bangLat = 13.006752 , bangLong = 77.561737 , puneLat = 18.5204, puneLong = 73.8567, patnaLat = 25.5941, patnaLong = 85.1376, dehradunLat = 30.3165, dehradunLong = 78.0322;

        var delhiDistance = HelperService.getDistanceBtwCordinates(delhiLat , delhiLong , latitude, longitude)
        var bangaloreDistance = HelperService.getDistanceBtwCordinates(bangLat , bangLong , latitude, longitude)
        var puneDistance = HelperService.getDistanceBtwCordinates(puneLat , puneLong , latitude, longitude)
        var patnaDistance = HelperService.getDistanceBtwCordinates(patnaLat , patnaLong , latitude, longitude)
        var dehradunDistance = HelperService.getDistanceBtwCordinates(dehradunLat , dehradunLong , latitude, longitude)
        if(delhiDistance< puneDistance && bangaloreDistance > delhiDistance && delhiDistance<patnaDistance&& delhiDistance<dehradunDistance){
          return 1; //Delhi
        }else if(bangaloreDistance > puneDistance && delhiDistance > puneDistance && patnaDistance>puneDistance && dehradunDistance>puneDistance){
          return 3; //Pune
        }else if(puneDistance>bangaloreDistance&& delhiDistance>bangaloreDistance&& patnaDistance>bangaloreDistance && dehradunDistance> bangaloreDistance){
          return 2; //Bangalore
        }else if(puneDistance>patnaDistance&&bangaloreDistance>patnaDistance&&delhiDistance>patnaDistance&& dehradunDistance>patnaDistance){
            return 4; //patna
        }else{
            return 5; // dehradun
        }
      } else {

        return 1;
      }
    },

    getGurgaonCityId: function(latitude, longitude){

       if(latitude && longitude){


        var gurLat = 28.457523, gurLong = 77.026344 , delhiLat = 28.644800 , delhiLong = 77.216721 , gazLat = 28.667856, gazLong = 77.449791;

        var delhiDistance = HelperService.getDistanceBtwCordinates(delhiLat , delhiLong , latitude, longitude)
        var gurgaonDistance = HelperService.getDistanceBtwCordinates(gurLat , gurLong , latitude, longitude)
        var ghaziabadDistance = HelperService.getDistanceBtwCordinates(gazLat , gazLong , latitude, longitude)

        if( gurgaonDistance > delhiDistance && ghaziabadDistance > delhiDistance){
          return 1; //Delhi
        }else if(ghaziabadDistance > gurgaonDistance && delhiDistance > gurgaonDistance){
          return 10; //Gurgaon
        }else{
          return 11; //Ghaziabad
        }
      
      }
    },

    getYehlankaCityId: function(latitude, longitude){

       if(latitude && longitude){


        var yehLat = 13.094454, yehLong = 77.586014 , bangLat = 13.006752 , bangLong = 77.561737  ;

        var bangaloreDistance = HelperService.getDistanceBtwCordinates(bangLat , bangLong , latitude, longitude)
        var yehlankaDistance = HelperService.getDistanceBtwCordinates(yehLat , yehLong , latitude, longitude)

        if(bangaloreDistance < yehlankaDistance ){
          return 2; 
        } else 
          return 11;//Yehlanka
      }
    },

    couponCodeUnavailableOnApp : function(couponCode){
        var data ={limit : 0 , offPercentage: 0 , couponDescription: "" , couponTitle : "" , imageUrl:"", couponId : "594a359d9856d3158171ea4f"} ;
        if(couponCode == "TRY50"){
            data.code = "TRY50";
            data.limit = 400;
            data.offPercentage = 50;
            data.couponDescription = "dadsads  dassdsda asdads";
        }
        if(data.offPercentage == 0)return null;
        else return data;
    },

    couponCodeUnavailableOnApp2 : function(couponCode, homeServiceOnly){
        var data ={limit : 0 , offPercentage: 0 , couponDescription: "" , couponTitle : "" , imageUrl:"", couponId : "594a359d9856d3158171ea4f"} ;
        if(couponCode == "TRY25"){
            data.code = "TRY25";
            data.limit = 200;
            data.offPercentage = 25;
            data.couponDescription = "dadsads  dassdsda asdads";
        }
        if(couponCode == "TRY50"){
            data.code = "TRY50";
            data.limit = 400;
            data.offPercentage = 50;
            data.couponDescription = "dadsads  dassdsda asdads";
        }
        if(couponCode == "BEUOLA"){
            data.code = "BEUOLA";
            data.limit = 1000;
            data.offPercentage = 100;
            data.minimumLimit = 2000;
        }
        if(couponCode == "EPAY50"){
            data.code = "EPAY50";
            data.limit = 500;
            data.offPercentage = 50;
            data.minimumLimit = 1000;
        }
        if(couponCode == "HOME" && homeServiceOnly){
            data.code = "HOME";
            data.limit = 500;
            data.offPercentage = 50;
            data.minimumLimit = 100;
        }
        if(couponCode == "NBISHT"){
            data.code = "NBISHT";
            data.limit = 500;
            data.offPercentage = 25;
            data.minimumLimit = 0;
            data.couponDescription = "Flat 25 % off";
        }
        if(data.offPercentage == 0)return null;
        else return data;
    },

    couponCodeDetailsForSalon: function(uc){
        var data ={limit : 0 , offPercentage: 0 , couponDescription: "" , couponTitle : "" , imageUrl:""} ;
        data.limit = uc.limit;
        data.openSalonList = true;
        data.offPercentage = uc.offPercentage;
        data.couponDescription =uc.couponDescription;
        data.couponTitle = uc.couponTitle;
        data.code =uc.code;
        return data;
    },

    couponCodeDetails:function(couponType, couponCode , percentage) {

        var data ={limit : 0 , offPercentage: 0 , couponDescription: "" , couponTitle : "" , imageUrl:""} ;
        if(couponType == 1){
            data.limit = 200;
            data.offPercentage = 15;
            data.couponDescription ="Use coupon to book appointment and get 15% off (Max ₹ 200) ";
            data.couponTitle = "Weekday Coupon "
            data.code ="WEEK15";
        }
        if(couponType == 2){
            data.limit = 100;
            data.offPercentage = 10;
            data.couponDescription ="Book appointment 24 hrs in advance and get 10% off (Max ₹ 100)";
            data.couponTitle = "24 hrs in advance";
            data.code ="24HR";

        }
        if(couponType == 3){
            data.limit = 300;
            data.offPercentage = 15;
            data.couponDescription ="Use coupon to book appointment and get 15% off (Max ₹ 300)";
            data.couponTitle = "Corporate Coupon";
            data.code ="CORPID15";
        }
        if(couponType == 4){
            data.limit = 100;
            data.offPercentage = 10;
            data.couponDescription ="Use coupon to book appointment and get 10% off (Max ₹ 100)";
            data.couponTitle = "App Discount Coupon";
            data.code = "APP10";
        }
        if(couponType == 5){
            data.limit = 500;
            data.offPercentage = 25;
            data.couponDescription ="Use coupon to book appointment and get 25% off (Max ₹ 500)";
            data.couponTitle = "Referral Coupon";
            data.code = "REFER25";
        }
        if(couponType == 25){
            data.limit = 500;
            data.offPercentage = 25;
            data.couponDescription ="Use coupon to book appointment and get 25% off (Max ₹ 500)";
            data.couponTitle = "Sign up Coupon";
            data.code = "SIGNUP25";
        }
        if(couponType == 26){
            data.limit = 400;
            data.offPercentage = 25;
            data.couponDescription ="Use coupon to book appointment and get 25% off (Max ₹ 400)";
            data.couponTitle = "Discount Coupon";
            data.code = "APP25";
        }
        if(couponType == 27){
            data.limit = 500;
            data.offPercentage = 50;
            data.couponDescription ="Use coupon to book appointment and get flat 50% off (Max ₹ 500)";
            data.couponTitle = "Discount Coupon";
            data.code = "APP50";
        }
        /*if(couponType == 28){
            data.limit = 500;
            data.offPercentage = 25;
            data.couponDescription ="Use coupon to book appointment and get flat 25% off (Max ₹ 500)";
            data.couponTitle = "Discount Coupon";
            data.code = "NBISHT";
        }*/
        // if(couponType == 6){
        //     data.limit = 200;
        //     data.offPercentage = 100;
        //     data.couponDescription ="Use coupon to book appointment and get 100% off (Max ₹ 200)";
        //     data.couponTitle = "OLA Coupon";
        //     data.code = "BEUOLA";

        // }

        if(couponType == 7){
          data.limit = 2000;
          data.offPercentage = percentage;
          data.couponDescription ="Use coupon to book appointment and get Global Color at flat ₹ 1499.";
          data.couponTitle = "Global Color @1499 Flat";
          data.code = "GBCOL";
            
        }
        if(couponType == 8){
           data.limit = 200;
            data.offPercentage = 10;
            data.couponDescription ="Use coupon to book appointment and get 10% off (Max ₹ 200) ";
            data.couponTitle = "Profile Coupon "
            data.code ="PROFILE10";
        }

         if(couponType == 10){
           data.limit = 500;
            data.offPercentage = 25;
            data.couponDescription ="Use coupon to book appointment and get 25% off (Max ₹ 500) ";
            data.couponTitle = "Referal Coupon "
            data.code ="REPEAT25";
        }
        if(couponType == 11){
           data.limit = 1000;
            data.offPercentage = 25;
            data.couponDescription ="Use coupon to book appointment and get 25% off (Max ₹ 1000) ";
            data.couponTitle = "Employee Coupon "
            data.code = couponCode;
        }
        if(couponType == 29){
            limit = 500,
            offPercentage = 50,
            couponDescription ="Use coupon to book appointment and get 50% off (Max ₹ 500)",
            couponTitle = "EPAYLATER user special discount",
            code = "EPAY50"
        }
        return data;
    },

    getFlashCouponDetails:function(detail){
        var data ={} ;  
        data.offPercentage = detail.offPercentage
        data.couponDescription = detail.description,
        data.couponTitle = detail.couponTitle,
        data.code = detail.code,
        data.serviceCodes = _.map(detail.serviceCodes, function(sc){
            return{
                serviceCode : sc.serviceCode,
                serviceId : sc.serviceId,
                brandId : sc.brandId,
                productId : sc.productId,
                serviceName : sc.serviceName,
            }
        }),
        data.couponType = detail.couponType,
        data.expiry=detail.expires_at,
        data.couponLeft=detail.currentCount,
        data.menuPrice=detail.menuPrice,
        data.price=detail.cityPrice[0].price
        data.ambience = detail.ambience;
        return data;
    },

      getFlashCouponDetailsForDeal:function(detail){
        var data ={} ;  
        data.offPercentage = detail.offPercentage
        data.categoryId = ConstantService.getFlashCouponCategoryId();
        data.description = detail.description,
        data.name = detail.couponTitle,
        data.code = detail.code;
        data.dealId = detail.dealId;
        data.imageUrl = detail.imageUrl;
        data.ambience = detail.ambience;
        data.dealType = "flash";
        data.serviceCode= detail.serviceCodes[0].serviceCode,
        data.serviceId = detail.serviceCodes[0].serviceId,
        data.brandId = detail.serviceCodes[0].brandId,
        data.serviceName = detail.serviceCodes[0].serviceName,
        data.productId = detail.serviceCodes[0].productId,
        data.serviceCodes = _.map(detail.serviceCodes, function(sc){
            return{
                serviceCode : sc.serviceCode,
                serviceId : sc.serviceId,
                brandId : sc.brandId,
                productId : sc.productId,
                serviceName : sc.serviceName,
            }
        }),
        data.couponType = detail.couponType,
        data.expiry=detail.expires_at,
        data.couponLeft=detail.currentCount,
        data.menuPrice=detail.menuPrice,
        data.price=detail.cityPrice[0].price
        return data;
    },

    getFreeThreadingServiceCode: function(){
      return 271;
    },

    getFlashCouponBanners:function(){
      var data = [];

         data.push({
            imageUrl : "https://res.cloudinary.com/dyqcevdpm/image/upload/v1525673309/homepage---flash-sale-banner_32_wopa1n.png",
            action : "coupon",
        });

         data.push({
            imageUrl : "https://res.cloudinary.com/dyqcevdpm/image/upload/v1525673458/homepage---flash-sale-banner_34_wgrnru.png",
            action : "coupon",
        });

        return {
            type : 'coupon',
            title : 'Flash Coupon Banner',
            list : data,
        };
    },

    getInactiveCoupons:function(detail) {

        var data ={} ;

                  data.couponDescription = detail.couponDescription,
                  data.couponTitle = detail.couponTitle,
                  data.code = 'INACTIVE',
                  data.popUpText ="Tap & Know How to Unlock",
                  data.popUpButtonText ="Earn",
                  data.active = false
            
       
        return data
    },


    getParlorTax:function(parlorTax , createdAt){
      var tax = 0;
      if(new Date(createdAt)> new Date(2018, 0, 10, 0, 0, 0) && parlorTax>0){
        tax = (parlorTax/100) +1;
      }else tax = parlorTax
      return tax
    },


    getHomePageBottomSheet:function(type , subscription){

     var data = {};

      if(type ==1){
          data.type = 'review',
          data.heading1 = 'Rate Your Experience',
          data.description= 'ddddddddddd',
          data.buttonText='bbbbbbbb',
          data.url= 'uuuuuu'
      }
      if(type ==2){
          data.type = 'update',
          data.heading1 = 'Update Now',
          data.description= 'Update your app to check out our new & exciting features',
          data.buttonText=' Update ',
          data.url= 'uuuuuu'
      }
      if(type ==3){
          data.type = 'showFeatures',
          data.heading1 = 'New Features',
          data.description= 'Explore new features in our latest update  ',
          data.buttonText=' Explore ',
          data.url= 'uuuuuu'
      }
      if(type ==4){
          data.type = 'goToUrl',
          data.heading1 = 'Go To URL',
          data.description= 'ddddddddddd',
          data.buttonText='bbbbbbbb',
          data.url= 'uuuuuu'
      }
      if(type ==5){
          data.type = 'preference',
          data.heading1 = 'Tell Us More About You',
          data.description= 'Let us know more about you to help you serve better ',
          data.buttonText=' Let Us Know ',
          data.url= 'uuuuuu'
      } 
      if(type ==6 && subscription == false){
          data.type = 'earnCoupon',
          data.heading1 = 'Earn Discount Coupons',
          data.description= 'Refer friends and earn a 30% discount coupon on each referral.',
          data.buttonText=' Earn ',
          data.url= 'uuuuuu'
      }
      if(type ==7){
          data.type = 'appointment',
          data.heading1 = 'Explore More',
          data.description= 'Music, Employee Rating, Service Tips ..',
          data.buttonText='Open',
          data.url= ''
      }
       return {
            data
        };
    },

    getUpdateImagesBottomSheet:function(){
      var data = [];
      // data.push({
      //   image : 'https://res.cloudinary.com/dyqcevdpm/image/upload/v1525686197/flash_sale_update_carousile_r9qd8y.png',
      //   heading : 'Weekly Flash Sale',
      //   description :  'Now check out unbelievable deals every week, every Monday to Thursday in our coupons section (new deals every week)',
      // });

      // data.push({
      //     image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1523435711/jpg-low-res-april-2018-susbscription-feature-banner_mzml5o.jpg',
      //     heading : 'Extend Your Subscription',
      //     description :  'New users can extend 1 month of subcription on subscribing to Be U Salons within 20 days of first login! For more details check the payment confirmation page.',
      //   });

      // data.push({
      //     image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1521280983/complete-your-profile-iphone_feature_update_ua4vgi.png',
      //     heading : 'Earn Discount Coupons',
      //     description :  'Fill in your profile & help us know more about you & get exclusive discounts.',
      //   });

      // data.push({
      //     image : 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1521699412/earn_coupons_banner_-_for_update_feature_rkmcfg.png',
      //     heading : 'Earn Discount Coupons',
      //     description :  'Visit our Freebies section to know how to get more exclusive discounts.',
      //   });

      return{
        data
      }

    },
    
    getAvailableCoupons: function(){
      var data =[
      {
            limit : 200,
            offPercentage : 15,
            couponType : 1,
            couponDescription :"Use coupon to book appointment and get 15% off (Max ₹ 200) ",
            couponTitle : "Weekday Coupon ",
            code :"WEEK15"
        },
        {
            limit : 100,
            offPercentage : 10,
            couponType : 2,
            couponDescription :"Book appointment 24 hrs in advance and get 10% off (Max ₹ 100)",
            couponTitle : "24 hrs in advance",
            code :"24HR"

        },
        {
            limit : 300,
            offPercentage : 15,
            couponType : 3,
            couponDescription :"Use coupon to book appointment and get 15% off (Max ₹ 300)",
            couponTitle : "Corporate Coupon",
            code :"CORPID15"
        },
        {
            limit : 100,
            offPercentage : 10,
            couponType : 4,
            couponDescription :"Use coupon to book appointment and get 10% off (Max ₹ 100)",
            couponTitle : "App Discount Coupon",
            code : "APP10"
        },
        {
            limit : 1000,
            offPercentage : 25,
            couponType : 5,
            couponDescription :"Use coupon to book appointment and get 25% off (Max ₹ 1000)",
            couponTitle : "Referral Coupon",
            code : "REFER25"
        },
        {
            limit : 500,
            offPercentage : 25,
            couponType : 25,
            couponDescription :"Use coupon to book appointment and get 25% off (Max ₹ 500)",
            couponTitle : "Referral Coupon",
            code : "SIGNUP25"
        },
        {
            limit : 500,
            offPercentage : 50,
            couponType : 27,
            couponDescription : "Use coupon to book appointment and get 50% off (Max ₹ 500)",
            couponTitle : "Referral Coupon",
            code : "APP50"
        },
       /* {
            limit : 500,
            offPercentage : 25,
            couponType : 28,
            couponDescription : "Use coupon to book appointment and get flat 25% off (Max ₹ 500)",
            couponTitle : "Discount Coupon",
            code : "NBISHT",
        },*/
        {
            limit : 400,
            offPercentage : 25,
            couponType : 26,
            couponDescription :"Use coupon to book appointment and get 25% off (Max ₹ 400)",
            couponTitle : "Referral Coupon",
            code : "APP25"
        },
        {   
            limit : 500,
            offPercentage : 50,
            couponType : 29,
            couponDescription : "Use coupon to book appointment and get 50% off (Max ₹ 500)",
            couponTitle : "EPAYLATER user special discount",
            code : "EPAY50"
        },
        {
            limit : 200,
            offPercentage : 100,
            couponType : 6,
            couponDescription :"Use coupon to book appointment and get 100% off (Max ₹ 200)",
            couponTitle : "OLA Coupon",
            code : "BEUOLA"

        },
        {
            limit : 200,
            offPercentage : 10,
            couponType : 8,
            couponDescription :"Use coupon to book appointment and get 10% off (Max ₹ 200) ",
            couponTitle : "Profile Coupon ",
            code :"PROFILE10"
        },
        {
            limit : 500,
            offPercentage : 25,
            couponType : 10,
            couponDescription :"Use coupon to book appointment and get 25% off (Max ₹ 500) ",
            couponTitle : "Referal Coupon ",
            code :"REPEAT25"
        }]
        return data;

    },


};
