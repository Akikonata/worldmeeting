(function() {

    function setColumnConfig(xArr, yArr, duration) {
        var columnConfig = {
            "color": ['#1782fb'],

            "xAxis": {
                "categories": xArr,

                "ticks": {
                    "enabled": true,
                    color: '#3d4659',
                    dash: [2],
                    width: 1
                },
                "margin": {
                    "right": 10,
                    "left": 60
                },

                "axis": {
                    enabled: true,
                    arrow: false,
                    color: '#8591a1'
                },
                "padding": {
                    "left": 20,
                    "right": 20
                },
                "label": {
                    "enabled": true,
                    "font": {
                        "color": "#FFF",
                        fontSize: 12
                    }
                },
                "min": 0
            },

            "yAxis": {
                "min": 0,
                "ticks": {
                    "enabled": true,
                    color: '#3d4659',
                    dash: [2],
                    width: 1
                },
                // grid : [-0.3, 0, 0.3, 0.6, 0.9],
                "label": {
                    "enabled": true,
                    "rotate": 0,
                    "font": {
                        "color": "#FFF",
                        fontSize: 12
                    },
                    format: function(num) {
                        return num;
                    }
                },
                unit: {
                    text: '消息数',
                    "font": {
                        "color": "#9096a1",
                        fontSize: 12
                    }
                },
                "axis": {
                    enabled: false,
                    arrow: false
                },
                "padding": {
                    "top": 0,
                    "bottom": 0
                }
            },

            "plotOptions": {

                "column": {
                    "width": 14,
                    "margin": 1
                },

                "label": {
                    "enabled": false
                }

            },

            "legend": {
                "enabled": false
            },

            "interaction": {
                "onStickHover": null
            },
            animation: {
                enabled: true,
                duration: duration || 1000,
                mode: 'ease',
                delayInterval: 200
            },
            "series": [{
                "name": "北京即时推送消息数",
                "data": yArr
            }]

        };

        return columnConfig;
    }

    window.Column = {
        init: function(id) {
            this.container = $('#' + id)[0];
            this.chart = this.chart || new kc.ColumnChart(id);
        },

        update: function(data, duration) {
            this.data = data;
            this.animDur = duration || 1000;

            this.conf = setColumnConfig(data.x, data.y, this.animDur);
            this.chart.update(this.conf);

            var self = this;
            setTimeout(function() {
                self.colorMax();
            }, 1000);

        },

        colorMax: function() {
            var arr = this.data.y,
                l = arr.length,
                max = 0,
                t = 0;

            for (var i = 0; i < l; i++) {
                if (arr[i] > max) {
                    max = arr[i];
                    t = i;
                }
            }

            var sticks = this.chart.getPlots().getPlotsElements().getElementList();
            sticks[l - t - 1].update({
                color: '#f0294a'
            });
        },

        setTotal: function(num) {
            num += '';
            $('.column .number').html(num.replace(/(?=(?!\b)(?:\d{3})+(?!\d))/g, ','));
        }
    }

})();