//for node..
var signals = signals || require('signals');
signals.CompoundSignal = signals.CompoundSignal || require('CompoundSignal');


describe('CompoundSignal', function () {

    it('should dispatch after other signals', function () {

            var s1 = new signals.Signal();
            var s2 = new signals.Signal();

            var count = 0;

            var cs = new signals.CompoundSignal(s1, s2);
            cs.add(function(p1, p2){
                expect( arguments.length ).toBe( 2 );
                expect( p1[0] ).toBe( "foo" );
                expect( p1[1] ).toBe( 123 );
                expect( p2[0] ).toBe( 456 );
                expect( p2[1] ).toBe( "bar" );
                count++;
            });

            //defaults
            expect( cs.memorize ).toBe( true );
            expect( cs.override ).toBe( false );
            expect( cs.unique ).toBe( true );

            s1.dispatch("foo", 123);
            s2.dispatch(456, "bar");

            expect( count ).toBe( 1 );
            expect( cs.getNumListeners() ).toBe( 0 );

    });


    it('should remove all listeners after dispatch', function () {

            var s1 = new signals.Signal();
            var s2 = new signals.Signal();

            var count = 0;

            var onCompound = function(p1, p2){
                expect( arguments.length ).toBe( 2 );
                expect( p1[0] ).toBe( "foo" );
                expect( p1[1] ).toBe( 123 );
                expect( p1[2] ).toBe( false );
                expect( p1[3] ).toBe( null );
                expect( p1[4] ).toBe( undefined );
                expect( p2[0] ).toBe( 456 );
                expect( p2[1] ).toBe( "bar" );
                count++;
            };

            var cs = new signals.CompoundSignal(s1, s2);
            cs.add(onCompound);

            s1.dispatch("foo", 123, false, null, undefined);
            s2.dispatch(456, "bar");

            expect( count ).toBe( 1 );

            //test if it removed previous listener and if it will dispatch
            //automatically
            expect( cs.has(onCompound) ).toBe( false );
            cs.add(onCompound);
            expect( count ).toBe( 2 );

    });

    it('should allow overriding previously dispatched values', function () {

            var s1 = new signals.Signal();
            var s2 = new signals.Signal();

            var count = 0;

            var onCompound = function(p1, p2){
                expect( arguments.length ).toBe( 2 );
                expect( p1[0] ).toBe( "foo" );
                expect( p1[1] ).toBe( 123 );
                expect( p2[0] ).toBe( 456 );
                expect( p2[1] ).toBe( "bar" );
                count++;
            };

            var cs = new signals.CompoundSignal(s1, s2);
            cs.override = true;
            cs.add(onCompound);

            s1.dispatch("lorem", 555);
            s1.dispatch("foo", 123);  //should override

            s2.dispatch(456, "bar");

            expect( count ).toBe( 1 );

            //test if it removed previous listener and if it will dispatch
            //automatically
            expect( cs.has(onCompound) ).toBe( false );
            cs.add(onCompound);
            expect( count ).toBe( 2 );

    });

    it('should allow resetting state', function () {

            var s1 = new signals.Signal();
            var s2 = new signals.Signal();

            var count = 0;

            var onCompound = function(p1, p2){
                expect( arguments.length ).toBe( 2 );
                expect( p1[0] ).toBe( "foo" );
                expect( p1[1] ).toBe( 123 );
                expect( p2[0] ).toBe( 456 );
                expect( p2[1] ).toBe( "bar" );
                count++;
            };

            var cs = new signals.CompoundSignal(s1, s2);
            cs.add(onCompound);

            s1.dispatch("lorem", 555);
            cs.reset(); // reset status
            s1.dispatch("foo", 123);  //should override

            s2.dispatch(456, "bar");

            expect( count ).toBe( 1 );

            //test if it removed previous listener and if it will dispatch
            //automatically
            expect( cs.has(onCompound) ).toBe( false );
            cs.add(onCompound);
            expect( count ).toBe( 2 );

        });


        it('should allow non unique', function () {

            var s1 = new signals.Signal();
            var s2 = new signals.Signal();

            var count = 0;

            var onCompound = function(p1, p2){
                expect( arguments.length ).toBe( 2 );
                expect( p1[0] ).toBe( "foo" );
                expect( p1[1] ).toBe( 123 );
                expect( p2[0] ).toBe( 456 );
                expect( p2[1] ).toBe( "bar" );
                count++;
            };

            var cs = new signals.CompoundSignal(s1, s2);
            cs.unique = false;
            cs.add(onCompound);

            s1.dispatch("foo", 123);
            s2.dispatch(456, "bar");

            expect( count ).toBe( 1 );

            //only removes listeners if not unique
            expect( cs.has(onCompound)  ).toBe( true );

            //mix order
            s2.dispatch(456, "bar");
            s1.dispatch("foo", 123);
            expect( count ).toBe( 2 );

        });

});
