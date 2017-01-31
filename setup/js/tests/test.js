
// Sample test group
describe('Array', function () {
    var array = [1,2,3];

    // // Things to setup before each test
    // beforeEach(function () {
    //
    // });

    // // Things to teardown after each test
    // afterEach(function () {
    //
    // });

    describe('Example passing', function () {
        it('should return -1 when the value is not present', function () {
            array.indexOf(5).should.equal(-1);
        });
    });

    // Can put more tests for this group

});
