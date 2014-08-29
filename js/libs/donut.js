(function() {

    function setDonutConfig(data, duration) {
        var donutConfig = {
            plotOptions: {
                pie: {
                    center: {
                        x: 200,
                        y: 200
                    },
                    innerRadius: 50,
                    outerRadius: 66,
                    incrementRadius: 16,
                    originAngle: 45,
                    animateAngle: 45,
                    gap: 28,
                    stroke: {
                        width: 0
                    },
                    shadow: {
                        enabled: false,
                        size: 1,
                        x: 0,
                        y: 0,
                        color: "rgba( 0, 0, 0, 0.3 )"
                    }
                },
                label: {
                    enabled: false
                }
            },
            legend: {
                enabled: false
            },
            animation: {
                enabled: true,
                duration: duration || 1000,
                mode: 'ease'
            }
        };

        var series = [],
            val;
        for (var i in data) {
            val = data[i].value;
            series.push({
                "name": i,
                "data": [{
                    "value": val,
                    "color": data[i].color
                }, {
                    "value": 100 - val,
                    "color": "#0b2b4c"
                }]
            });
        }

        donutConfig.series = series;
        return donutConfig;
    }

    var lines = [];

    function connect(chart, conf) {
        var label = chart.addElement('', new kc.Line({
            x1: conf.x,
            y1: conf.y,
            x2: conf.x,
            y2: conf.y,
            width: 1,
            color: conf.color
        }));

        label.animate({
            x2: conf.x + conf.length * conf.dir,
        }, conf.duration);

        lines.push(label);
    }

    window.Donut = {
        init: function(id) {
            this.container = $('#' + id)[0];
            this.chart = this.chart || new kc.PieChart(id);
        },

        update: function(data, duration) {
            this.data = data;
            this.animDur = duration || 1000;

            this.conf = setDonutConfig(data, this.animDur);
            this.chart.update(this.conf);

            this.setLabels();
        },

        setLabels: function() {

            var self = this;
            lines.forEach(function(l) {
                self.chart.canvas.removeShape(l.canvas);
            });

            $('.donut-label').remove();

            var list = this.chart.getParamList();

            setTimeout(function() {
                list.forEach(function(param, i) {
                    if (i % 2 != 0) return;

                    var r = param.innerRadius,
                        angle = param.startAngle + param.pieAngle - 90 + param.originAngle,
                        a = angle / 180 * Math.PI,
                        center = self.conf.plotOptions.pie.center;

                    var x = r * Math.cos(a) + center.x,
                        y = r * Math.sin(a) + center.y;

                    var entry = self.data[i / 2],
                        dir = (angle < 90 || angle > 270) ? 1 : -1,
                        length = 80,
                        duration = 600;

                    var label = $('<div class="donut-label" style="color:' + entry.color + '">' + entry.label + '</div>').appendTo(self.container);
                    label.css({
                        color: entry.color,
                        left: x + 'px',
                        top: (y - label.height() / 2) + 'px',
                        webkitTransition: duration + 'ms',
                        webkitTransform: 'translate3d(' + (dir > 0 ? length + 5 : -length - label.width() - 5) + 'px, 0, 0)'
                    })

                    connect(self.chart, {
                        x: x,
                        y: y,
                        dir: dir,
                        length: length,
                        color: entry.color,
                        duration: duration
                    });

                });
            }, this.animDur);

        }
    }

})();