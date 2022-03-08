// <div id="heatmap_chart" class="chart"></div>
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

var main_pallet = colorPallet_5_rev

var start_time
var curr_block_start_time
var speed_times_array_all = []
var curr_iter = 0

var screen_ =
    {
        layers: [
            {
                elements: [
                    {prc: 0.3, atomic_number: 5},
                    {prc: 0.7, atomic_number: 15}
                ],
                width: 1
            },
            {
                elements: [
                    {prc: 1, atomic_number: 10}
                ],
                width: 2
            }
        ]
    };

var config = {
    values_use_in_clasterization: {
        all_weight:1,
        all_width:1,
        layer_width:1,
        prc:1,
        sequence_number:1,
        period:1,
        group:1,
        subgroup:1,
        atomic_mass:1,
        element_type:1,
        electronegativity:1,
        melting_point:1,
        boiling_point:1,
        density:1
    },
    z_axis_value: {
        weight:1,
        width:0
    },
    color_value: {
        weight:1,
        width:0
    },
    text_value: {
        weight:1,
        width:1
    }
}

var visual_config = {
    background:'#343a40'
}


var screen_range_all_ =
    {
        layers: [
            {
                elements: [
                    {prc: [0,0.3,0.1], atomic_number: [1,2]},
                    {prc: [0,0.3,0.1], atomic_number: [1,2]}
                ],
                width: [1,2]
            },
            {
                elements: [
                    {prc: 1, atomic_number: [1,2]}
                ],
                width: [1,2]
            }
        ]
    };

var screen_range_ =
    {
        layers: [
            {
                elements: [
                    {prc: [0,1,0.2], atomic_number: [10,12]},
                    {prc: [0,1,0.2], atomic_number: 15}
                ],
                width: [0,2]
            },
            {
                elements: [
                    {prc: 1, atomic_number: 20}
                ],
                width: [0,2]
            }
        ]
    };




function set_layer_width_value(screens_array, layer_index_set, val)
{
    for (var screen_range_index=0; screen_range_index < screens_array.length; screen_range_index+=1)
    {
        screens_array[screen_range_index].layers[layer_index_set].width = val
    }
    return screens_array
}

function set_atomic_number_value(screens_array, layer_index_set,element_index_set, val)
{
    for (var screen_range_index=0; screen_range_index < screens_array.length; screen_range_index+=1)
    {
        screens_array[screen_range_index].layers[layer_index_set].elements[element_index_set].atomic_number = val
    }
    return screens_array
}

function set_prc_arr_value(screens_array, layer_index_set, val_arr)
{
    for (var screen_range_index=0; screen_range_index < screens_array.length; screen_range_index+=1)
    {
        for (element_index = 0; element_index < screens_array[screen_range_index].layers[layer_index_set].elements.length; element_index+=1)
        {
            screens_array[screen_range_index].layers[layer_index_set].elements[element_index].prc = val_arr[element_index]
        }
    }
    return screens_array
}



function get_all_pairs(start,end,step,cnt)
{
    arr = []
    for (var i=0; i < cnt; i+=1)
    {
        arr.push(range_step(start,end,step))
    }


    pairs = [...cartesian(...arr)];
    //console.log('pairs ', pairs);

    pairs_filtered = []
    pairs.forEach((item,index,array) => {
        var val = 0;
        item.forEach((item1,index1,array1) => {
            val += item1 / end;
        })
        if (val === 1) pairs_filtered.push(item);
    })
    //console.log('pairs_filtered ', pairs_filtered);
    return pairs_filtered

    //let pairs = ...cartesian(...arr)
    //console.log('pairs ', pairs)
}



function check_screen_range_layer(screen_range)
{
    flag = 0
    screen_range.layers.forEach((item,index,arr) => {
        if (typeof(item.width) === 'object')
            flag += 1
    })

    return flag
}

function check_screen_range_atomic_number(screen_range)
{
    flag = 0
    screen_range.layers.forEach((item,index,arr) => {
        item.elements.forEach((item1,index1,arr1) => {
        if (typeof(item1.atomic_number) === 'object')
            flag += 1
        })

})

    return flag
}


function check_screen_range_prc(screen_range)
{
    flag = 0
    screen_range.layers.forEach((item,index,arr) => {
        item.elements.forEach((item1,index1,arr1) => {
            if (typeof(item1.prc) === 'object')
    flag += 1
})

})

    return flag
}


//TODO Берется первый масисв значений типо все остальные такие же но если мы хотим задать значения для стали то там куча элементов и
// нет смысла перебирать все. Там желехо например от 90 до 100 проц а примеси делят остальные 10 проц
// надо предусмотреть что быть генерация пар была с учетом верных границ для каждого элемента, в целом это не так сложно,
// надо перебирать каждую пару из массива значений а массивы генерить строго на оснвое конфига
// в get_all_pairs передаем массив массивов конфигов, а там убрать генерации входных данных на оснвое первого
// а там оставить цикл перебора массивов конфигов для генерации полного массива значений и все по сути - должно сработать
function screen_range_prc(screen_range_arr, arr_out)
{
    var screen_range_arr_length = screen_range_arr.length
    for (var screen_range_index=0; screen_range_index < screen_range_arr_length; screen_range_index+=1)
    {

        buff_screen = (JSON.parse(JSON.stringify(screen_range_arr[screen_range_index])))

        if(check_screen_range_prc(buff_screen) === 0)
        {
            //arr_out.push(JSON.parse(JSON.stringify(buff_screen)))
        } else {
            //screen_range.layers.forEach((item, index, arr) =>
            //for (var [index, item] of screen_range.layers)
            for (var index=0; index < buff_screen.layers.length; index+=1)
            {
                if (typeof (buff_screen.layers[index].elements[0].prc) === 'object') {

                    var start = buff_screen.layers[index].elements[0].prc[0]
                    var end = buff_screen.layers[index].elements[0].prc[1]
                    var step = buff_screen.layers[index].elements[0].prc[2]
                    //var range_arr = range_step(start,end,step)

                    //console.log('start, ', start, ' end ', end, ' step ', step, ' val ', Math.round((end - start)/step))
                    //console.log('range_arr ', range_arr)
                    var cnt = buff_screen.layers[index].elements.length;

                    //arrays_prc = []
                    //for(var i=0;i<buff_screen.layers[index].elements.length; i+=1){
                    //    arrays_prc.push(range_arr)
                    //}

                    pairs_prc = get_all_pairs(start,end,step,cnt)

                    //console.log('pairs_prc ',pairs_prc)
                    //console.log('range_arr ',range_arr)
                    pairs_prc.forEach((pairs_prc_element, index1, arr1) => {

                        //console.log('pairs_prc_element ',pairs_prc_element)
                        pairs_prc_element.forEach((prc, index2, arr2) => {
                            buff_screen.layers[index].elements[index2].prc = prc
                            //console.log('screen ', JSON.parse(JSON.stringify(buff_screen)))
                        })
                        arr_out.push(JSON.parse(JSON.stringify(buff_screen)))
                        //console.log('screen ', JSON.parse(JSON.stringify(buff_screen)))
                    })
                    //console.log('arr_out deep ', JSON.stringify(arr_out))

                    //for (var index_element = 0; index_element < buff_screen.layers[index].elements.length; index_element += 1) {
                        //console.log('screen_range_layer ', typeof (buff_screen.layers[index].width), ' ', buff_screen.layers[index])


                        //console.log('obj')
                        //var range_arr = range(buff_screen.layers[index].elements[index_element].atomic_number[0], buff_screen.layers[index].elements[index_element].atomic_number[1])
                        //range_arr.forEach((item1, index1, arr1) =>
                        //{
                        //    buff_screen.layers[index].elements[index_element].atomic_number = item1
                            //console.log('buff_screen ', buff_screen)
                        //    arr_out.push(JSON.parse(JSON.stringify(buff_screen)))
                            //console.log('arr_out deep ', JSON.stringify(arr_out))
                        //}
                    //)
                    }

                }
            }
        }
    //}

    //console.log('arr_out deep ', JSON.stringify(arr_out))

    var flag = 0
    //console.log('screen_range_atomic_number - arr_out', arr_out)
    for (var index=0; index < arr_out.length; index+=1){
        flag += check_screen_range_prc(arr_out[index], [])
    }
    arr_out2 = []
    //console.log('flag ', flag)
    //console.log('arr_out last ', JSON.parse(JSON.stringify(arr_out)))
    if(flag > 0) return screen_range_prc(arr_out, [])
    else return arr_out

}


function screen_range_layer(screen_range_arr, arr_out)
{
    //console.log('screen_range_arr ',screen_range_arr.length)
    //console.log('screen_range_arr ',JSON.stringify(screen_range_arr))
    //console.log('arr_out ',arr_out)
    //screen_range_arr.forEach((screen_range,screen_range_index,screen_range_a) =>
    var screen_range_arr_length = screen_range_arr.length
    for (var screen_range_index=0; screen_range_index < screen_range_arr_length; screen_range_index+=1)
    {

        buff_screen = (JSON.parse(JSON.stringify(screen_range_arr[screen_range_index])))

        if(check_screen_range_layer(buff_screen) === 0)
        {
            arr_out.push(JSON.parse(JSON.stringify(buff_screen)))
        } else {
        //screen_range.layers.forEach((item, index, arr) =>
        //for (var [index, item] of screen_range.layers)
        for (var index=0; index < buff_screen.layers.length; index+=1)
            {
                //console.log('screen_range_layer ', typeof (buff_screen.layers[index].width), ' ', buff_screen.layers[index])
                if(typeof(buff_screen.layers[index].width) === 'object')
                {
                    //console.log('obj')
                    var range_arr = range_step(buff_screen.layers[index].width[0], buff_screen.layers[index].width[1], buff_screen.layers[index].width[2])
                    range_arr.forEach((item1, index1, arr1) =>
                        {
                            buff_screen.layers[index].width = item1
                            //console.log('buff_screen ', buff_screen)
                            arr_out.push(JSON.parse(JSON.stringify(buff_screen)))
                            //console.log('arr_out deep ', JSON.stringify(arr_out))
                        }
                    )
                }
            }}
    }

    var flag = 0
    for (var index=0; index < arr_out.length; index+=1){
        flag += check_screen_range_layer(arr_out[index])
    }
    arr_out2 = []
    if(flag > 0) return screen_range_layer(arr_out, [])
    else return arr_out

}


function screen_range_atomic_number(screen_range_arr, arr_out)
{
    //console.log('screen_range_arr ',screen_range_arr.length)
    //console.log('screen_range_arr ',JSON.stringify(screen_range_arr))
    //console.log('arr_out ',arr_out)
    //screen_range_arr.forEach((screen_range,screen_range_index,screen_range_a) =>
    var screen_range_arr_length = screen_range_arr.length
    for (var screen_range_index=0; screen_range_index < screen_range_arr_length; screen_range_index+=1)
    {

        buff_screen = (JSON.parse(JSON.stringify(screen_range_arr[screen_range_index])))

        if(check_screen_range_atomic_number(buff_screen) === 0)
        {
            arr_out.push(JSON.parse(JSON.stringify(buff_screen)))
        } else {
            //screen_range.layers.forEach((item, index, arr) =>
            //for (var [index, item] of screen_range.layers)
            for (var index=0; index < buff_screen.layers.length; index+=1)
            {
                for (var index_element=0; index_element < buff_screen.layers[index].elements.length; index_element+=1) {
                    //console.log('screen_range_layer ', typeof (buff_screen.layers[index].width), ' ', buff_screen.layers[index])
                    if (typeof (buff_screen.layers[index].elements[index_element].atomic_number) === 'object') {
                        //console.log('obj')
                        var range_arr = range(buff_screen.layers[index].elements[index_element].atomic_number[0], buff_screen.layers[index].elements[index_element].atomic_number[1])
                        range_arr.forEach((item1, index1, arr1) =>
                        {
                            buff_screen.layers[index].elements[index_element].atomic_number = item1
                            //console.log('buff_screen ', buff_screen)
                            arr_out.push(JSON.parse(JSON.stringify(buff_screen)))
                            //console.log('arr_out deep ', JSON.stringify(arr_out))
                        }
                    )
                    }
                }
            }}
    }

    var flag = 0
    //console.log('screen_range_atomic_number - arr_out', arr_out)
    for (var index=0; index < arr_out.length; index+=1){
        flag += check_screen_range_atomic_number(arr_out[index], [])
    }
    arr_out2 = []
    if(flag > 0) return screen_range_atomic_number(arr_out, [])
    else return arr_out

}



var OUT_DATA;
var screens_array;


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(color) {

    return "#" + componentToHex(Math.floor(255*color[0])) + componentToHex(Math.floor(255*color[1])) + componentToHex(Math.floor(255*color[2]));
}

function Resize_value(value, min, max)
{
    return ((100 / (max - min)) * (value - min)) / 100;
}
function Get_Color2(value)
{
    var color3f = [0, 0, 0];


    color3f[0] = Resize_value(value, 0, 1);
    color3f[1] = 1 - Resize_value(value, 0, 1);
    color3f[2] = 0;

    if(isNaN(value)) color3f = [1, 0, 0];


    return color3f;
}
//var colorscaleValue3_RGB = [
//    [0.000, 1, 0, 0],
//    [1.000, 0, 1, 0]
//]
function Get_Color(value_in)
{
    colors = colorscaleValue3_RGB


    if (value_in <= 0) value = 0
    else if (value_in >= 1) value = 1
    else value = value_in;

    for (var i=0; i < colors.length-1;i++)
    {
        //console.log(colors[i])
        if (value > colors[i][0] && value <= colors[i+1][0]) {
            //console.log('i: ', i, ' - ', i + 1);

            res_val = Resize_value(value, colors[i][0], colors[i+1][0])
            //console.log('res_val: ',res_val)

            var R = colors[i][1] + ((colors[i+1][1] - colors[i][1]) * res_val)
            var G = colors[i][2] + ((colors[i+1][2] - colors[i][2]) * res_val)
            var B = colors[i][3] + ((colors[i+1][3] - colors[i][3]) * res_val)

            //console.log('value_in ',value_in)
            //console.log('R,G,B ',R,G,B)

            return [R,G,B]
            //console.log('RGB: ',R,G,B)
        }
    }
    return [colors[0][1],colors[0][2],colors[0][3]]
}

function Get_Color_old(value)
{
    var color3f = [0, 0, 0];

    //0 0 1 -> 0.27 1 1 -> 0 1 0 -> 1 0.8 0 -> 1 0 0

    var tran_1 = 0;
    var tran_2 = 0.25;
    var tran_3 = 0.5;
    var tran_4 = 0.75;
    var tran_5 = 1;



    if (value <= tran_2)
    {
        color3f[0] = 0.27 * Resize_value(value, tran_1, tran_2);
        color3f[1] = Resize_value(value, tran_1, tran_2);
        color3f[2] = 1;
    } else
    if (value <= tran_3)
    {
        color3f[0] = 0.27 - 0.27 * Resize_value(value, tran_2, tran_3);
        color3f[1] = 1;
        color3f[2] = 1 - Resize_value(value, tran_2, tran_3);
    } else
    if (value <= tran_4)
    {
        color3f[0] = Resize_value(value, tran_3, tran_4);
        color3f[1] = 1 - (1 - 0.8) * Resize_value(value, tran_3, tran_4);
        color3f[2] = 0;
    } else
    if (value <= tran_5)
    {
        color3f[0] = 1;
        color3f[1] = 0.8 - 0.8 * Resize_value(value, tran_4, tran_5);
        color3f[2] = 0;
    } else
    if (value > tran_5)
    {
        color3f[0] = 1;
        color3f[1] = 0;
        color3f[2] = 0;
    }



    return color3f;
}

function getHexFromValue(val,min,max)
{
    //console.log('getHexFromValue ', val, min, max, Resize_value(val,min,max));
    return rgbToHex(Get_Color(1 - Resize_value(val,min,max)));
}

function getHexPallet(pallet) {
    hex_pallet = []
    pallet.forEach(
        function(item, i, arr) {
            hex_pallet.push( [item[0], rgbToHex([item[1],item[2],item[3]])] )
        }
    )

    //console.log('hex_pallet ', hex_pallet)
    return hex_pallet
}

function init_tsne()
{
    worker = new Worker('js/tsne/worker.js');

    // тут инит гугл чартов

    worker.onmessage = function (e) {
        var msg = e.data;

        switch (msg.type) {
            case 'PROGRESS_STATUS':
                $('#progress-status').text(msg.data);
                break;
            case 'PROGRESS_ITER':
                $('#progress-iter').text(msg.data[0] + 1);
                $('#progress-error').text(msg.data[1].toPrecision(7));
                $('#progress-gradnorm').text(msg.data[2].toPrecision(5));
                break;
            case 'PROGRESS_DATA':
                // тут код для визуализации через гугл чарты
                // только обновление данных
                OUT_DATA = msg.data;

                //draw_charts();
                //drawUpdate(msg.data);
                break;
            case 'STATUS':
                if (msg.data === 'READY') {
                    $('#run-button1').bind('click', run);
                    $('#run-button2').bind('click', run);
                    $('#run-button3').bind('click', run);
                } else {
                    $('#run-button1').unbind('click', run);
                    $('#run-button2').unbind('click', run);
                    $('#run-button3').unbind('click', run);
                }
                break;
            case 'DONE':
                //drawUpdate(msg.data);
                // тут код для визуализации через гугл чарты
                if ($('#cb_logs').is(':checked')) console.log(msg.data);
                OUT_DATA = msg.data;


                var curr_time = performance.now();
                if ($('#cb_logs_time').is(':checked')) console.log('t-SNE | Общее Время выполнения: ', Math.round(curr_time - start_time), ' ms | Текущего блока: ', Math.round(curr_time - curr_block_start_time), ' ms');


                draw_charts();

                var curr_time = performance.now();
                if ($('#cb_logs_time').is(':checked')) console.log('All | Общее Время выполнения: ', Math.round(curr_time - start_time), ' ms');


                speed_times_array_all.push(Math.round(curr_time - start_time))

                iters = parseInt( $('#iteration_speed_test').val() )

                curr_iter += 1
                if (curr_iter >= iters) {


                    if ($('#cb_speed_test').is(':checked'))
                    {
                        console.log('Массив общего времени:')
                        var str_to_xlsx = ''
                        speed_times_array_all.map(String).forEach(element => str_to_xlsx +=  element + '\t')
                        //str_to_xlsx += '\n'
                        console.log(str_to_xlsx)
                    }

                    speed_times_array_all = []
                    curr_iter = 0

                } else {
                    run()
                }


                break;
            default:
        }
    }

}


function prepareData() {

    replace_x = $('#replase_x').val()
    json_str = $('#param-set_val_conf_descrp_json').val()
    //console.log(json_str)
    json_str = json_str.replaceAll('{{X}}', replace_x)
    //console.log(json_str)

    screen_range = JSON.parse(json_str)
    if ($('#cb_logs').is(':checked')) console.log(screen_range)

    screens_array1 = screen_range_layer([screen_range], [])
    if ($('#cb_logs').is(':checked')) console.log('screens_array1 ', screens_array1)
    screens_array2 = screen_range_atomic_number(screens_array1, [])
    if ($('#cb_logs').is(':checked')) console.log('screens_array2 ', screens_array2)
    screens_array = screen_range_prc(screens_array2, []);
    if ($('#cb_logs').is(':checked')) console.log('screens_array ', screens_array)

    return screens_array.map((k) => screen_to_array(k))
}


function run ()
{


    start_time = performance.now()


    var iters = 1
    //if ($('#cb_speed_test').is(':checked'))
    //{
    //    iters = parseInt( $('#iteration_speed_test').val() )
    //    replace_x = $('#replase_x').val()
    //}

    var speed_times_array = []
    for (  var i = 0; i < iters; i++ ) {

        curr_block_start_time = performance.now();

        //console.log('out ', screens_array)
        SAMPLE_DATA = prepareData()
        if ($('#cb_logs').is(':checked')) console.log('SAMPLE_DATA ', SAMPLE_DATA)

        var curr_time = performance.now();
        var curr_block_time = Math.round(curr_time - curr_block_start_time)
        speed_times_array.push(curr_block_time)

    }

    if ($('#cb_logs_time').is(':checked')) console.log('Prepare data | Общее Время выполнения: ', Math.round(curr_time - start_time), ' ms | Текущего блока: ', speed_times_array, ' ms');

    if ($('#cb_speed_test').is(':checked'))
    {
        var str_to_xlsx = replace_x
        speed_times_array.map(String).forEach(element => str_to_xlsx +=  '\t' + element)
        //str_to_xlsx += '\n'
        console.log(str_to_xlsx)
    }



    // -------------------------------



    curr_block_start_time = performance.now();

    if ($('#cb_t_sne').is(':checked')) {

        worker.postMessage({
            type: 'INPUT_DATA',
            data: SAMPLE_DATA
        });

        worker.postMessage({
            type: 'RUN',
            data: {
                perplexity: parseInt($('#param-perplexity').val(), 10),
                earlyExaggeration: parseFloat($('#param-earlyexag').val()),
                learningRate: parseInt($('#param-learningrate').val(), 10),
                nIter: parseInt($('#param-maxiter').val(), 10),
                metric: $('#param-distance').val(),
                dim: 3
            }
        });
    }
}

function atomic_to_density(atomic)
{
    return chem_elements_db.find(x => x['порядковый номер'] === atomic)['плотность']
}

function layer_to_dens(layer)
{
    dens = 0;
    layer.elements.forEach(
        function(item, i, arr) {
            dens += item.prc * chem_elements_db.find(x => x['порядковый номер'] === item.atomic_number)['плотность'];
        }
    )
    return dens;
}

function screen_to_weight(screen)
{
    weight = 0;
    screen.layers.forEach(
        function(item, i, arr) {
            weight += item.width * layer_to_dens(item);
        }
    );
    return weight;
}

function screen_to_width(screen)
{
    width = 0;
    screen.layers.forEach(
        function(item, i, arr) {
            width += item.width
        }
    );
    return width;
}

function element_to_array(element)
{
    arr = []
    element_data = chem_elements_db.find(x => x['порядковый номер'] === element.atomic_number);


    if (config.values_use_in_clasterization.prc) arr.push(element.prc);
    if (config.values_use_in_clasterization.sequence_number) arr.push(element_data['порядковый номер']);
    if (config.values_use_in_clasterization.period) arr.push(element_data['период']);
    if (config.values_use_in_clasterization.group) arr.push(element_data['группа']);
    if (config.values_use_in_clasterization.subgroup) arr.push(element_data['подгруппа']);
    if (config.values_use_in_clasterization.atomic_mass) arr.push(element_data['атомная масса']);
    if (config.values_use_in_clasterization.element_type) arr.push(element_data['вид элемента']);
    if (config.values_use_in_clasterization.electronegativity) arr.push(element_data['электроотрицательность']);
    if (config.values_use_in_clasterization.melting_point) arr.push(element_data['температура плавления']);
    if (config.values_use_in_clasterization.boiling_point) arr.push(element_data['температура кипения']);
    if (config.values_use_in_clasterization.density) arr.push(element_data['плотность']);

    return arr;
}

function layer_to_array(layer)
{
    arr_out = [];

    if (config.values_use_in_clasterization.layer_width) arr_out.push(layer.width);

    layer.elements.forEach(
        function(item, i, arr)
        {
            arr_out.push(...element_to_array(item))
        }
    );
    return arr_out;
}

function screen_to_array(screen)
{
    arr_out1 = [];
    if (config.values_use_in_clasterization.all_weight)  arr_out1.push(screen_to_weight(screen));
    if (config.values_use_in_clasterization.all_width)  arr_out1.push(screen_to_width(screen));
    screen.layers.forEach(
        function(item, i, arr)
        {
            arr_out1.push(...layer_to_array(item));
        }
    );
    return arr_out1;
}

function range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

function range_step(start, end, step)
{
    return Array(Math.round((end - start)/step)+1).fill().map((_, idx) => start + parseFloat((idx*step).toFixed(5)))
}

function pairs_generator(parts)
{
    return parts.reduce(
        (a, b) => a.reduce(
            (r, v) => r.concat(
                b.map(
                    w => [].concat(v, w)
                )
            ), []
        )
    );
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}


function screens_generator(base_screen)
{

    width_min = 1
    width_max = 10

    screens_array = []

    layers_widths_array = []

    for(var i=0; i < base_screen.layers.length;i++)
    {
        var array_of_width = range(width_min,width_max)
        layers_widths_array.push(array_of_width)
    }

    //console.log('base_screen ',base_screen)

    if ($('#cb_logs').is(':checked')) console.log('screens_generator - layers_widths_array: ', layers_widths_array)
    pairs_layers_width = pairs_generator(layers_widths_array)

    if ($('#cb_logs').is(':checked')) console.log('screens_generator - pairs_layers_width: ', pairs_layers_width)

    pairs_layers_width.forEach(
        function(item1, i, arr)
        {
            //console.log(item,i)

            var buff_base_screen = Object.assign({}, base_screen)
            item1.forEach(
                function(item2, i, arr)
                {
                    buff_base_screen.layers[i].width = item2
                    buff_base_screen.layers[i].elements.forEach(
                        function(item3, i, arr)
                        {
                            //item3.atomic_number = Math.floor(Math.random()*108)+1
                        })

                })
            //console.log('item1 ',item1,' | buff_base_screen ',JSON.stringify(buff_base_screen))
            screens_array.push(JSON.parse(JSON.stringify(buff_base_screen)))

        }
    )

    if ($('#cb_logs').is(':checked')) console.log('screens_array: ', screens_array)


    screens_data = screens_array.map((k) => screen_to_array(k))

    if ($('#cb_logs').is(':checked')) console.log('screens_data: ', screens_data)

    return screens_data


}

function* cartesian(head, ...tail) {
    let remainder = tail.length ? cartesian(...tail) : [[]];
    for (let r of remainder) for (let h of head) yield [h, ...r];
}

function screen_to_target_color_value(screen) {
    if (config.color_value.width == 1) return screen_to_width(screen);
    if (config.color_value.weight == 1) return screen_to_weight(screen);
    return 0;
}

function screen_to_target_value_by_config(screen) {
    if (config.color_value.width == 1) return screen_to_width(screen);
    if (config.color_value.weight == 1) return screen_to_weight(screen);
    return 0;
}

function screens_array_to_colors_array() {

    var data_for_color_arr = [];
    var с = [];
    screens_array.forEach(
            function (item, i, arr) {
                data_for_color_arr.push(screen_to_target_color_value(screens_array[i]))
            })
    var arr_min = Math.min(...data_for_color_arr)
    var arr_max = Math.max(...data_for_color_arr)
    screens_array.forEach(
        function (item, i, arr) {
            c.push(getHexFromValue(data_for_color_arr[i], arr_min, arr_max))
        })
    return c;
}

function screen_array_to_text_tooltip() {
    t = []
    screens_array.forEach(
        function (item, i, arr) {
            text = ''
            if (config.text_value.width == 1)
                text += '<b>width:</b> ' + screen_to_width(item).toString() + '<br>';
            if (config.text_value.width == 1)
                text += '<b>weight:</b> ' + screen_to_weight(item).toString() + '<br>';
            t.push(text)
        })
    return t
}


function playNote(frequency, duration) {
    // create Oscillator node
    var oscillator = audioCtx.createOscillator();

    oscillator.type = 'square';
    oscillator.frequency.value = frequency; // value in hertz
    oscillator.connect(audioCtx.destination);
    oscillator.start();

    setTimeout(
        function() {
            oscillator.stop();
        }, duration);
}

function screen_array_to_sound(ind) {

    if (ind != false) {


        //console.log('screen_array_to_sound - screens_array[ind]: ', screens_array[ind])

        val = screen_to_target_value_by_config(screens_array[ind])


        var data_for_sound_arr = [];

        screens_array.forEach(
            function (item, i, arr) {
                data_for_sound_arr.push(screen_to_target_value_by_config(screens_array[i]))
            })
        var arr_min = Math.min(...data_for_sound_arr)
        var arr_max = Math.max(...data_for_sound_arr)


        //kek
        // 0 to 1 for sound
        val_res = 1 - Resize_value(val, arr_min, arr_max)
        var note = ((val_res * (3000 - 100)) + 100)
        var duration = 10
        var tempo = 100
        playNote(note, 1000 * 256 / (duration * tempo));

        if ($('#cb_logs').is(':checked')) console.log('screen_array_to_sound - ind: ', ind, 'screens_array[ind]: ', screens_array[ind], 'freq: ', note, 'duration: ', duration)


    }

    return 0
}

function add_sound_to_Plotly(div_id)
{
    var myPlot = document.getElementById(div_id)
    myPlot.on('plotly_hover', function(data){
        var infotext = data.points.map(function(d){
            if ($('#cb_logs').is(':checked')) console.log(d)
            screen_array_to_sound(d.pointNumber)
        });
    })
}

function add_click_event(div_id) {

    var myPlot = document.getElementById(div_id)
    myPlot.on('plotly_click', function(data){
        var infotext = data.points.map(function(d){
            if ($('#cb_logs').is(':checked')) console.log(d)
            //screen_array_to_sound(d.pointNumber)

            var options_json = {
                collapsed: false,
                rootCollapsable: false,
                withQuotes: true,
                withLinks: true
            };

            if ($('#cb_logs').is(':checked')) console.log('screens_array[d.pointNumber]: ', screens_array[d.pointNumber])
            $('#selected_json').jsonViewer(screens_array[d.pointNumber], options_json)
        });
    })

}

function screen_to_target_z_value(screen)
{
    if (config.z_axis_value.width == 1) return screen_to_width(screen);
    if (config.z_axis_value.weight == 1) return screen_to_weight(screen);
    return 0;
}

function screens_array_to_z_array()
{
    z = [];
    screens_array.forEach(
        function (item, i, arr) {
            z.push(screen_to_target_z_value(screens_array[i]))
        })
    return z;

}

function draw_chart()
{

    x=[]; y=[]; z=[]; c=[];t=[];
    screen_to_weight_arr = []
    OUT_DATA.forEach(
        function(item, i, arr)
        {
            x.push(item[0])
            y.push(item[1])
        }
    )

    z = screens_array_to_z_array();
    с = screens_array_to_colors_array();
    t = screen_array_to_text_tooltip();

    if ($('#cb_logs').is(':checked')) console.log('draw_chart - data');


// Plotting the mesh
    var data=[
        {
            //opacity:0.99,
            //vertexcolor: c,
            type: 'heatmap',
            colorscale: 'Jet',
            zsmooth: 'best',
            x: x,
            y: y,
            z: z,
            text:t,
            hoverinfo: 'text',

        }
    ];

    var layout = {
            //hovermode: "closest"
            autosize: true,
            paper_bgcolor:visual_config.background,
            //width: 100,
            //height: 500,
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 0,
                pad: 0
            }
        }

    //            colorscale: [
    //                 [Math.min(...c), 'rgb(255, 0, 0)'],
    //                 [(Math.max(...c)-Math.min(...c))/2.0, 'rgb(0, 255, 0)'],
    //                 [Math.max(...c), 'rgb(0, 0, 255)']
    //             ],

    //console.log(data);

    Plotly.newPlot('heatmap_chart', data, layout);
}

function draw_chart_4()
{

    x=[]; y=[]; z=[]; c=[];t=[]
    screen_to_weight_arr = []
    OUT_DATA.forEach(
        function(item, i, arr)
        {
            x.push(item[0])
            y.push(item[1])
        }
    )
    z = screens_array_to_z_array();
    с = screens_array_to_colors_array();
    t = screen_array_to_text_tooltip();
    //console.log('t ',t)

    //console.log('text: ', t);
    //hovertemplate:
    //    "<b>%{text}</b><br><br>" +
    //    "x: %{y}<br>" +
    //    "y: %{x}<br>" +
    //    "<extra></extra>",



// Plotting the mesh
    var data=[
        {
            //opacity:0.99,
            //vertexcolor: c,
            type: 'contour',
            colorscale: 'Jet',
            zsmooth: 'best',
            line:{
                smoothing: 0.85
            },
            colorscale: getHexPallet(main_pallet),
            showscale: false,
            connectgaps: true,
            contours: {
                coloring: 'heatmap',
                showlabels: true,
                labelfont: {
                    family: 'Raleway',
                    size: 12,
                    color: 'white',
                }
            },
            x: x,
            y: y,
            z: z,
            text:t,
            hoverinfo: 'text',
        }
    ];

    //            colorscale: [
    //                 [Math.min(...c), 'rgb(255, 0, 0)'],
    //                 [(Math.max(...c)-Math.min(...c))/2.0, 'rgb(0, 255, 0)'],
    //                 [Math.max(...c), 'rgb(0, 0, 255)']
    //             ],

    //console.log(data);

    var layout = {
        //hovermode: "closest"
        autosize: true,
        paper_bgcolor:visual_config.background,
        //width: 100,
        //height: 500,
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
            pad: 0
        }
    }



    Plotly.newPlot('contour_chart', data, layout);

    add_sound_to_Plotly('contour_chart');
    add_click_event('contour_chart')
}

function draw_chart_2() {

    x = [];
    y = [];
    z = [];
    c = [];
    t = [];
    screen_to_weight_arr = []



    OUT_DATA.forEach(
        function (item, i, arr) {
            x.push(item[0])
            y.push(item[1])
        }
    )
    с = screens_array_to_colors_array();
    t = screen_array_to_text_tooltip();



    var trace1 = {
        x: x,
        y: y,
        text:t,
        hoverinfo: 'text',
        mode: 'markers',
        type: 'scatter',
        marker: {
            color: c
        }
    };

    var layout = {
        hovermode: "closest",
        autosize: true,
        paper_bgcolor:visual_config.background,
        plot_bgcolor:visual_config.background,
        fillcolor:visual_config.background,
        //width: 100,
        //height: 500,
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
            pad: 0
        },
        xaxis :{
            gridcolor: '#787878',
            linecolor: '#787878',
            tickcolor: '#787878',
            zerolinecolor: '#787878',

        },
        yaxis: {
            gridcolor: '#787878',
            linecolor: '#787878',
            tickcolor: '#787878',
            zerolinecolor: '#787878',
        }
    }

    //console.log('colors:', c);
    Plotly.newPlot('scatter_chart', [trace1], layout);

    add_sound_to_Plotly('scatter_chart');
    add_click_event('scatter_chart')
}

function draw_chart_5()
{

    x=[]; y=[]; z=[]; c=[]; t=[];
    screen_to_weight_arr = []
    OUT_DATA.forEach(
        function(item, i, arr)
        {
            // console.log('item: ', item)
            x.push(item[0])
            y.push(item[1])
            // z.push(item[2])
            z = screens_array_to_z_array();
        }
    )
    z = screens_array_to_z_array();
    с = screens_array_to_colors_array();
    t = screen_array_to_text_tooltip();


// Plotting the mesh
    var data=[
        {
            type: 'scatter3d',
            mode: 'markers',
            x: x,
            y: y,
            z: z,
            text:t,
            hoverinfo: 'text',
            marker: {
                symbol: 'circle',
                color: c,
                size:7,
                line: {
                    color: '#787878',
                }
            },
        },
        {
            type: 'mesh3d',
            x: x,
            y: y,
            z: z,
            text:t,
            hoverinfo: 'text',
            alphahull: 7,
            opacity: 0.1,
        }
    ];

    var layout = {
        //hovermode: "closest"
        autosize: true,
        paper_bgcolor:visual_config.background,
        //width: 100,
        //height: 500,
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
            pad: 0
        },
        xaxis :{
            gridcolor: '#787878',
            linecolor: '#787878',
            tickcolor: '#787878',
            zerolinecolor: '#787878',

        },
        yaxis: {
            gridcolor: '#787878',
            linecolor: '#787878',
            tickcolor: '#787878',
            zerolinecolor: '#787878',
        },
        zaxis: {
            gridcolor: 'rgb(255, 0, 0)',
            linecolor: 'rgb(255, 0, 0)',
            tickcolor: 'rgb(255, 0, 0)',
            zerolinecolor: 'rgb(255, 0, 0)',
        }
    }



    Plotly.newPlot('chart_mesh3d', data, layout);

    add_sound_to_Plotly('chart_mesh3d')
    add_click_event('chart_mesh3d')
}




function draw_charts()
{
    //console.log('draw_chart')
    //draw_chart();
    curr_block_start_time = performance.now();

    if ($('#cb_logs').is(':checked')) console.log('draw_chart_2')
    if ($('#cb_visualization').is(':checked'))draw_chart_2();

    var curr_time = performance.now();
    if ($('#cb_logs_time').is(':checked')) console.log('2D | Общее Время выполнения: ', Math.round(curr_time - start_time), ' ms | Текущего блока: ', Math.round(curr_time - curr_block_start_time), ' ms');

    //console.log('draw_chart_3')
    //if ($('#cb_visualization').is(':checked'))draw_chart_3();

    curr_block_start_time = performance.now();

    if ($('#cb_logs').is(':checked')) console.log('draw_chart_5')
    if ($('#cb_visualization').is(':checked'))draw_chart_5();

    var curr_time = performance.now();
    if ($('#cb_logs_time').is(':checked')) console.log('3D | Общее Время выполнения: ', Math.round(curr_time - start_time), ' ms | Текущего блока: ', Math.round(curr_time - curr_block_start_time), ' ms');



    curr_block_start_time = performance.now();

    if ($('#cb_logs').is(':checked')) console.log('draw_chart_4')
    if ($('#cb_visualization').is(':checked')) draw_chart_4();

    var curr_time = performance.now();
    if ($('#cb_logs_time').is(':checked')) console.log('HeatMap | Общее Время выполнения: ', Math.round(curr_time - start_time), ' ms | Текущего блока: ', Math.round(curr_time - curr_block_start_time), ' ms');


}





$(function() {


    init_tsne();

    $('#param-perplexity').bind('input', function () { $('#param-perplexity-value').text($('#param-perplexity').val()); });
    $('#param-earlyexag').bind('input', function () { $('#param-earlyexag-value').text($('#param-earlyexag').val()); });
    $('#param-learningrate').bind('input', function () { $('#param-learningrate-value').text($('#param-learningrate').val()); });
    $('#param-maxiter').bind('input', function () { $('#param-maxiter-value').text($('#param-maxiter').val()); });

    $('#param-epsilon').bind('input', function () { $('#param-epsilon-value').text($('#param-epsilon').val()); });
    $('#param-min-pts').bind('input', function () { $('#param-min-pts-value').text($('#param-min-pts').val()); });


    $('#param-set_val_test').bind('input', function () {
        $('#param-set_val_test-value').text($('#param-set_val_test').val());
        //screens_array = set_layer_width_value(screens_array, 1, parseInt($('#param-set_val_test').val()));


        screens_array = set_atomic_number_value(screens_array, 1,0, parseInt($('#param-set_val_test').val()));
        if ($('#cb_logs').is(':checked')) console.log('screens_array ', screens_array)

        draw_charts();
    });

    if ($('#cb_logs').is(':checked')) console.log('screen: ', screen);




    screen_range = JSON.parse($('#param-set_val_conf_descrp_json').val())
    if ($('#cb_logs').is(':checked')) console.log(screen_range)

    screens_array1 = screen_range_layer([screen_range], [])
    if ($('#cb_logs').is(':checked')) console.log('screens_array1 ', screens_array1)
    screens_array2 = screen_range_atomic_number(screens_array1, [])
    if ($('#cb_logs').is(':checked')) console.log('screens_array2 ', screens_array2)
    screens_array = screen_range_prc(screens_array2, []);
    if ($('#cb_logs').is(':checked')) console.log('screens_array ', screens_array)


    //console.log('out ', screens_array)
    SAMPLE_DATA = screens_array.map((k) => screen_to_array(k))
    if ($('#cb_logs').is(':checked')) console.log('SAMPLE_DATA ', SAMPLE_DATA)

    worker.postMessage({
        type: 'INPUT_DATA',
        data: SAMPLE_DATA
    });











    //screens_array = screen_range_layer([screen_range], [])


    //screen_range = JSON.parse($('#param-set_val_conf_descrp_json').val())
    //console.log(screen_range)

    //screens_array1 = screen_range_layer([screen_range], [])
    //console.log('screens_array1 ', screens_array1)
    //screens_array2 = screen_range_atomic_number(screens_array1, [])
    //console.log('screens_array2 ', screens_array2)
    //screens_array = screen_range_prc(screens_array2, []);
    //console.log('screens_array ', screens_array)


    ////console.log('out ', screens_array)
    //SAMPLE_DATA = screens_array.map((k) => screen_to_array(k))
    //console.log('SAMPLE_DATA ', SAMPLE_DATA)


    //get_all_pairs(3)



    //console.log('arr_out_1 ', arr_out_1);
    //r = range_step(0,1,0.01)
    //console.log(r)



    //console.log('                       ')
    //console.log('                       ')
    //out2 = screen_range_layer(out, [])
    //console.log('out2 ', out2)

    //console.log('chem_elements_db: ', chem_elements_db);
    //console.log('atomic_to_density(10): ', atomic_to_density(10));

    //console.log('layer_to_dens 0: ', layer_to_dens(screen.layers[0]));
    //console.log('layer_to_dens 1: ', layer_to_dens(screen.layers[1]));


    //console.log('screen.layers[0].elements[0]: ', screen.layers[0].elements[0]);
    //console.log('element_to_array: ', element_to_array(screen.layers[0].elements[0]));


    //console.log('screen.layers[0]: ', screen.layers[0]);
    //console.log('layer_to_array: ', layer_to_array(screen.layers[0]));
    //console.log('layer_to_array: ', layer_to_array(screen.layers[1]));

    //console.log('                       ')
    //console.log('screen_to_array: ', screen_to_array(screen));

    //console.log('                       ')
    //var SAMPLE_DATA = screens_generator(screen)



    // worker.postMessage({
    //     type: 'INPUT_DATA',
    //     data: SAMPLE_DATA
    // });


    //run();



});