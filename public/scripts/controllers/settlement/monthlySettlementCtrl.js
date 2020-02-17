angular.module('sbAdminApp').controller('monthlySettlementCtrl', function($scope,$http,$timeout) {
	$scope.loginRole = role;
	$scope.loginUserType = userType;
	$scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  $scope.toggleMin = function() {
    $scope.minDate = new Date(2017, 0, 1)
  };
  $scope.toggleMin();
  $scope.maxDate = new Date(2020, 5, 22);

  $scope.open = function($event) {
    $scope.status.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate','MMM'];
  $scope.format = $scope.formats[4];

  $scope.status = {
    opened: false
	};
	



		$scope.user=role;
			$scope.parlors=[];
			$scope.selected={};
			if ((role == 2 || role == 7) && (userType == 0)) {
				
						$scope.selected.parlor=parlorId
					}


			// console.log('hello ')

$scope.month=[{name:'January',value:0},{name:'February',value:1},{name:'March',value:2},{name:'April',value:3},{name:'May',value:4},
{name:'June',value:5},{name:'July',value:6},{name:'August',value:7},{name:'September',value:8},{name:'October',value:9},{name:'November',value:10},{name:'December',value:11}]

$scope.check=function()
		{

			// console.log($scope.dt);
			// console.log($scope.selected)
			
		}


	if(role==1)
	{
				$http.post('/role1/allParlors').success(function(response)
		{
					$scope.parlors=response.data;
					// console.log('name',response.data);
					$scope.selected.parlor=response.data[0].parlorId;
		})



	}



	$scope.getData=function(){


				$scope.data={
					date:$scope.dt,
					parlorId:$scope.selected.parlor
				}
// console.log($scope.data)
			$http.post('/role3/monthlySettlement',$scope.data)
			.success(function(res){
				// console.log('HI',res)
				$scope.fillData=res.data.sett[0];
                // console.log($scope.fillData);
			})



	}
$scope.getData();
  $scope.amount = '';
        $scope.convertNumberToWords1 = function(num) {
            return convertNumberToWords(num);
        };

        // console.log($scope.amount);

        function convertNumberToWords(amount) {
            var words = new Array();
            words[0] = '';
            words[1] = 'One';
            words[2] = 'Two';
            words[3] = 'Three';
            words[4] = 'Four';
            words[5] = 'Five';
            words[6] = 'Six';
            words[7] = 'Seven';
            words[8] = 'Eight';
            words[9] = 'Nine';
            words[10] = 'Ten';
            words[11] = 'Eleven';
            words[12] = 'Twelve';
            words[13] = 'Thirteen';
            words[14] = 'Fourteen';
            words[15] = 'Fifteen';
            words[16] = 'Sixteen';
            words[17] = 'Seventeen';
            words[18] = 'Eighteen';
            words[19] = 'Nineteen';
            words[20] = 'Twenty';
            words[30] = 'Thirty';
            words[40] = 'Forty';
            words[50] = 'Fifty';
            words[60] = 'Sixty';
            words[70] = 'Seventy';
            words[80] = 'Eighty';
            words[90] = 'Ninety';

            amount = amount.toString();
            var atemp = amount.split(".");
            var number = atemp[0].split(",").join("");
            var n_length = number.length;
            var words_string = "";
            if (n_length <= 9) {
                var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
                var received_n_array = new Array();
                for (var i = 0; i < n_length; i++) {
                    received_n_array[i] = number.substr(i, 1);
                }
                for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
                    n_array[i] = received_n_array[j];
                }
                for (var i = 0, j = 1; i < 9; i++, j++) {
                    if (i == 0 || i == 2 || i == 4 || i == 7) {
                        if (n_array[i] == 1) {
                            n_array[j] = 10 + parseInt(n_array[j]);
                            n_array[i] = 0;
                        }
                    }
                }
                var value = "";
                for (var i = 0; i < 9; i++) {
                    if (i == 0 || i == 2 || i == 4 || i == 7) {
                        value = n_array[i] * 10;
                    } else {
                        value = n_array[i];
                    }
                    if (value != 0) {
                        words_string += words[value] + " ";
                    }
                    if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                        words_string += "Crores ";
                    }
                    if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                        words_string += "Lakhs ";
                    }
                    if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                        words_string += "Thousand ";
                    }
                    if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                        words_string += "Hundred";
                    } else if (i == 6 && value != 0) {
                        words_string += "Hundred ";
                    }
                }
                words_string = words_string.split("  ").join(" ");
            }
            return words_string;
        }
            
    $scope.GenerateInvoice=function(){
                     $scope.num = (Math.ceil(Math.random() * 9));
                    $scope.data={
					date:$scope.dt,
					parlorId:$scope.selected.parlor
				}
                  $http.post('/role3/monthlySettlement',$scope.data).success(function(res){
                    // console.log(res);
                       $scope.fillData=res.data.parlor;
                            // console.log($scope.fillData.gstNumber);
                      console.log($scope.fillData.gstNumber.substring(0,4));
                                if($scope.fillData.gstNumber.substring(0,4)==':07A'){  
                                    // console.log('this is true')
                                    $scope.indicator=true;
                                    
                          
                      }else{
                          $scope.indicator=false;
                         // console.log("this is not true")
                      }
                      $scope.fillData1=res.data.sett[0];
                      // console.log($scope.fillData1);
                     
                      $scope.toPrint=$scope.parlors.filter(function(a){
                            return  a.parlorId==$scope.selected.parlor;      
                        })
                   // console.log($scope.toPrint);
                    $scope.convertNumberToWords1($scope.amount);
                    $timeout(function() {
                        var innerContents = document.getElementById('salonInvoice').innerHTML;
                        var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                        popupWinindow.document.open();
                        popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
                        popupWinindow.document.close();
                    })

                });

}

			

})