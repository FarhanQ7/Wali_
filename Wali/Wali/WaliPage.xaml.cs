using Xamarin.Forms;

namespace Wali
{
	public partial class WaliPage : ContentPage
	{
		public WaliPage()
		{
			InitializeComponent();

					var webView = new WebView 
		  {
		     Source = "/Users/ffquresh/Projects/Wali/Wali/rootpage.html",
		     VerticalOptions = LayoutOptions.FillAndExpand,
		     HorizontalOptions = LayoutOptions.FillAndExpand
		  };

			Content = webView;



		}
	}
}
