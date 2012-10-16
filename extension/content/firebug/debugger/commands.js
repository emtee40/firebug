/* See license.txt for terms of usage */

define([
    "firebug/lib/trace",
    "firebug/debugger/rdp",
],
function(FBTrace, RDP) {

// ********************************************************************************************* //
// Constants

// ********************************************************************************************* //
// Command Implementation

function pauseGrip(context, args)
{
    var actor = args[0];
    var type = args[1];

    var context = Firebug.currentContext;
    if (!context)
        return "No current context";

    var client = context.debuggerClient;
    if (!client)
        return "Debugger client not available";

    var thread = client.activeThread;
    if (!thread)
        return "The debugger must be paused";

    if (!actor)
        return "No actor specified";

    var cache = context.debuggerClient.activeThread.gripCache;

    var packet = {
        to: actor,
        type: type || RDP.DebugProtocolTypes.prototypeAndProperties
    };

    cache.request(packet).then(function(response)
    {
        Firebug.Console.log(response);
    });

    return Firebug.Console.getDefaultReturnValue(context.window);
}

function tabGrip(context, args)
{
    var actor = args[0];
    var type = args[1];

    var context = Firebug.currentContext;
    if (!context)
        return "No current context";

    if (!actor)
        return "No actor specified";

    if (!type)
        return "No type specified";

    var packet = {
        to: actor,
        type: type
    };

    Firebug.proxy.connection.request(packet, function(response)
    {
        Firebug.Console.log(response);
    });

    return Firebug.Console.getDefaultReturnValue(context.window);
}

// ********************************************************************************************* //
// Registration

Firebug.registerCommand("pauseGrip", {
    handler: pauseGrip.bind(this),
    description: "Helper command for accessing server side Grips. For debugging purposes only."
})

Firebug.registerCommand("tabGrip", {
    handler: tabGrip.bind(this),
    description: "Helper command for accessing server side tab child Grips. For debugging purposes only."
})

return {};

// ********************************************************************************************* //
});