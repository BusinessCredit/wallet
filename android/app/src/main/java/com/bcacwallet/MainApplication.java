package com.bcacwallet;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.burnweb.rnwebview.RNWebViewPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.tradle.react.UdpSocketsModule;
import com.peel.react.TcpSocketsModule;
import com.horcrux.svg.SvgPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.lewin.qrcode.QRScanReaderPackage;
import org.wonday.pdf.RCTPdfView;
import com.peel.react.rnos.RNOSModule;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.psykar.cookiemanager.CookieManagerPackage;
import org.reactnative.camera.RNCameraPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNWebViewPackage(),
            new RNFetchBlobPackage(),
            new VectorIconsPackage(),
            new UdpSocketsModule(),
            new TcpSocketsModule(),
            new SvgPackage(),
            new ReactNativeRestartPackage(),
            new QRScanReaderPackage(),
            new RCTPdfView(),
            new RNOSModule(),
            new RNI18nPackage(),
            new RNDeviceInfo(),
            new CookieManagerPackage(),
            new RNCameraPackage(),
            new RandomBytesPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
