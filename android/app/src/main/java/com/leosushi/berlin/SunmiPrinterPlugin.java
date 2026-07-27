package com.leosushi.berlin;

import android.util.Base64;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.sunmi.peripheral.printer.InnerPrinterCallback;
import com.sunmi.peripheral.printer.InnerPrinterException;
import com.sunmi.peripheral.printer.InnerPrinterManager;
import com.sunmi.peripheral.printer.SunmiPrinterService;

@CapacitorPlugin(name = "SunmiPrinter")
public class SunmiPrinterPlugin extends Plugin {

    private static final String TAG = "SunmiPrinterPlugin";
    private SunmiPrinterService sunmiPrinterService;
    private boolean isConnected = false;

    @Override
    public void load() {
        super.load();
        initSunmiPrinter();
    }

    private void initSunmiPrinter() {
        try {
            InnerPrinterManager.getInstance().bindService(getContext(), new InnerPrinterCallback() {
                @Override
                protected void onConnected(SunmiPrinterService service) {
                    sunmiPrinterService = service;
                    isConnected = true;
                    Log.d(TAG, "Sunmi Printer Service Connected");
                }

                @Override
                protected void onDisconnected() {
                    sunmiPrinterService = null;
                    isConnected = false;
                    Log.d(TAG, "Sunmi Printer Service Disconnected");
                }
            });
        } catch (Throwable e) {
            e.printStackTrace();
            Log.e(TAG, "Sunmi Printer Service Bind Exception: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getStatus(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("connected", isConnected);
        ret.put("hasService", sunmiPrinterService != null);
        call.resolve(ret);
    }

    @PluginMethod
    public void printRaw(PluginCall call) {
        String base64Data = call.getString("data");
        if (base64Data == null || base64Data.isEmpty()) {
            call.reject("Must provide data");
            return;
        }

        if (sunmiPrinterService == null) {
            // Try to re-init
            initSunmiPrinter();
            call.reject("Sunmi Printer Service not connected");
            return;
        }

        try {
            byte[] bytes = Base64.decode(base64Data, Base64.DEFAULT);
            sunmiPrinterService.sendRAWData(bytes, null);
            call.resolve();
        } catch (Exception e) {
            call.reject("Print failed: " + e.getMessage());
        }
    }
}
